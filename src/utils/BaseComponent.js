import Utils from '../utils/Utils';


class BaseComponent {


  /** @summary Component abstraction to be used in each color picker type
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This abstract component hold any useful methods for all color picker types.
   * It handle the construction and deletion of them, among with their mouse/touch events.</blockquote>
   * @param {string} type - The picker type
   * @param {object} options - The color picker definition
   * @param {object} options.renderTo - The HTMl DOM element to render the picker in
   * @param {object} options.style - An object with css rules for bg, border, picker and padding
   * @param {function} options.onColorChange - The callback to be called each time a color is selected */
	constructor(type, options) {
    /** @private
     * @member {string} - The component type. Only 'linear' or 'radial' are supported */
    this._type = type;
    /** @private
     * @member {object} - The DOM element to render canvases in */
		this._renderTo = options.renderTo;
    /** @private
     * @member {object} - The style object for component custom styling */
    this._style = {
      bg: options.style ? (options.style.bg ? options.style.bg : 'white') : 'white',
      border: options.style ? (options.style.border ? options.style.border : 'black') : 'black',
      picker: options.style ? (options.style.picker ? options.style.picker : 'white') : 'white',
      padding: options.style ? (options.style.padding ? options.style.padding : 20) : 20
    };
    /** @private
     * @member {function} - The callback method to call on each color modification */
		this._onColorChange = options.onColorChange;
    /** @private
     * @member {object} - Color and light canvases used in all types */
		this._canvas = {
			light: null,
			colors: null
		};
    /** @private
     * @member {object} - Canvases associated contexts */    
		this._ctx = {
			light: null,
			colors: null
		};
    /** @private
     * @member {boolean} - Flag to memorize if user is clicked and moving on color canvas */
		this._isMouseDownOnColor = false;
    /** @private
     * @member {boolean} - Flag to memorize if user is clicked and moving on light canvas */
		this._isMouseDownOnLight = false;			
	}


  /** @method
   * @name destroy
   * @public
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Method to clear events and remove all component properties.</blockquote> **/
	destroy() {
		this._renderTo.removeChild(this._dom.wrapper);
    this._canvas.colors.removeEventListener('mousedown', this._mouseDownOnColor);
    this._canvas.light.removeEventListener('mousedown', this._mouseDownOnLight);
    document.removeEventListener('mousemove', this._mouseMoveOnColor);
    document.removeEventListener('mousemove', this._mouseMoveOnLight);    
    document.removeEventListener('mouseup', this._mouseUp);
    window.removeEventListener('resize', this._onResize);
    Object.keys(this).forEach(key => { delete this[key]; });	
	}


  /** @method
   * @name _events
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Subscribe to any mouse and touch events to make the color picker react to user interaction.</blockquote> **/
	_events() {
		// Enforce this binding for proper destruction later on
    this._mouseDownOnColor = this._mouseDownOnColor.bind(this);
    this._mouseMoveOnColor = this._mouseMoveOnColor.bind(this);
    this._mouseDownOnLight = this._mouseDownOnLight.bind(this);
    this._mouseMoveOnLight = this._mouseMoveOnLight.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    this._onResize = this._onResize.bind(this);
    // Subscribe to mouse event to react
    this._canvas.colors.addEventListener('mousedown', this._mouseDownOnColor);
    this._canvas.light.addEventListener('mousedown', this._mouseDownOnLight);
    document.addEventListener('mousemove', this._mouseMoveOnColor);
    document.addEventListener('mousemove', this._mouseMoveOnLight);    
    document.addEventListener('mouseup', this._mouseUp);
    window.addEventListener('resize', this._onResize);
	}


  /** @method
   * @name _mouseDownOnColor
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>A click or touch down event was fire on color canvas.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseDownOnColor(e) {
		this._isMouseDownOnColor = true;
  	const rect = this._canvas.colors.getBoundingClientRect();
    let currentX = e.clientX - rect.left;
		this._picker.colors.x = currentX;
    this._draw();    
	}


  /** @method
   * @name _mouseMoveOnColor
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>A click or touch move event was fire on document.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseMoveOnColor(e) {
    if (this._isMouseDownOnColor) {
	  	const rect = this._canvas.colors.getBoundingClientRect();
	    let currentX = e.clientX - rect.left;
      
      if (currentX >= this._canvas.colors.width) {
      	currentX = this._canvas.colors.width - 1;
      } else if (currentX <= 0) {
      	currentX = 1;
      }

      this._picker.colors.x = currentX;
	    this._draw();
    }
	}


  /** @method
   * @name _mouseDownOnLight
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>A click or touch move event was fire on light canvas.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseDownOnLight(e) {
		this._isMouseDownOnLight = true;
  	const rect = this._canvas.light.getBoundingClientRect();
    let currentX = e.clientX - rect.left;
    let currentY = e.clientY - rect.top;

    if (currentX >= this._canvas.light.width) {
    	currentX = this._canvas.light.width - 1;
    } else if (currentX <= 0) {
    	currentX = 1;
    }

    if (currentY >= this._canvas.light.height) {
    	currentY = this._canvas.light.height - 1;
    } else if (currentY <= 0) {
    	currentY = 1;
    }

		this._picker.light.x = currentX;
		this._picker.light.y = currentY;
    this._draw(); 
	}


  /** @method
   * @name _mouseMoveOnLight
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>A click or touch move event was fire on document.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseMoveOnLight(e) {
    if (this._isMouseDownOnLight) {
    	const rect = this._canvas.light.getBoundingClientRect();
      let currentX = e.clientX - rect.left;
      let currentY = e.clientY - rect.top;

      if (currentX >= this._canvas.light.width) {
      	currentX = this._canvas.light.width - 1;
      } else if (currentX <= 0) {
      	currentX = 1;
      }

      if (currentY >= this._canvas.light.height) {
      	currentY = this._canvas.light.height - 1;
      } else if (currentY <= 0) {
      	currentY = 1;
      }

      this._picker.light.x = currentX;
      this._picker.light.y = currentY;
	    this._draw();
    }
	}


  /** @method
   * @name _mouseUp
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>A click or touch up event was fired document. Release move flags.</blockquote> **/
	_mouseUp() {
		this._isMouseDownOnColor = false;
		this._isMouseDownOnLight = false;
	}



  /** @method
   * @name _onResize
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Callback that re-computes the components dimension on each window resize
   * This method must be overriden in each child class to properly implement resizement.</blockquote> **/
  _onResize() {
    // Must be overriden in child classes
  }


  /** @method
   * @name _getPickedColor
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Get the color under the picker for the color canvas.</blockquote>
   * @returns {object} An object containing the R, G and B values under the color picker **/
	_getPickedColor() {
		return Utils.getPickedPixelOnCtx(this._ctx.colors, this._picker.colors);
	}


  /** @method
   * @name _getPickedLight
   * @private
   * @memberof BaseComponent
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Get the color under the picker for the light canvas.</blockquote>
   * @returns {object} An object containing the R, G and B values under the light picker **/
	_getPickedLight() {
		return Utils.getPickedPixelOnCtx(this._ctx.light, this._picker.light);
	}	


}


export default BaseComponent;
