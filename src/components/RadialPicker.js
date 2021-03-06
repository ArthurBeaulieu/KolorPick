import BaseComponent from '../utils/BaseComponent';
import Utils from '../utils/Utils';


class RadialPicker extends BaseComponent {


  /** @summary Classical radial color picker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This class will build a radial color picker, containing a circular slider to
   * select a color, and a light picker to alter this selected color to lighten or darken it.</blockquote>
   * @param {object} options - The color picker definition
   * @param {object} options.renderTo - The HTMl DOM element to render the picker in
   * @param {function} options.onColorChange - The callback to be called each time a color is selected */
	constructor(options) {
		super('radial', options);
    /** @private
     * @member {object} - Component DOM skeleton */
		this._dom = {
			wrapper: null,
			canvasWraper: null
		};
    /** @private
     * @member {object} - Graphical picker on each canvases to feedback the user where its selection is */
		this._picker = {
			light: {
				x: 0,
				y: 0,
				r: 10
			},
			colors: {
				x: 0,
				y: 0,
				w: 8,
				h: 30,
				a: 0
			}
		};
		// Component init sequence
    // In case of vertical scrollbar, force resize to make canvas properly fit in parent width
    requestAnimationFrame(() => {
			this._init();
			this._draw();
			this._events();
    });		
	}


  /** @method
   * @name _init
   * @private
   * @memberof RadialPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Method to initialize the component DOM and variables, to be ready to be then built.</blockquote> **/
	_init() {
		// Create DOM elements
		this._dom.wrapper = document.createElement('DIV');
		this._dom.canvasWraper = document.createElement('DIV');
		this._canvas.colors = document.createElement('CANVAS');
		this._canvas.light = document.createElement('CANVAS');
		// Chain DOM elements
		this._dom.canvasWraper.appendChild(this._canvas.colors);
		this._dom.canvasWraper.appendChild(this._canvas.light);
		this._dom.wrapper.appendChild(this._dom.canvasWraper);
		this._renderTo.appendChild(this._dom.wrapper);
		// Set DOM elements style
		this._dom.wrapper.style.cssText = `background-color:${this._style.bg};width:100%;`;
		this._dom.canvasWraper.style.cssText = `padding:${this._style.padding}px;position:relative;width:100%;`;
		this._canvas.colors.style.cssText = 'width:100%';
		this._canvas.light.style.cssText = `border:solid 1px ${this._style.border};position:absolute;left:calc(20% + ${this._style.padding}px);top:calc(20% + ${this._style.padding}px);width:calc(60% - ${this._style.padding * 2}px);`;
    // Setup light canvas
    this._canvas.light.width = (60 * this._dom.canvasWraper.offsetWidth) / 100 - (this._style.padding * 2);
    this._canvas.light.height = (60 * this._dom.canvasWraper.offsetWidth) / 100 - (this._style.padding * 2); // Colors canvas has to be square (otherwise, !circle)
		this._ctx.light = this._canvas.light.getContext('2d');
		// Setup color canvas
    this._canvas.colors.width = this._dom.canvasWraper.offsetWidth - (this._style.padding * 2);
    this._canvas.colors.height = this._dom.canvasWraper.offsetWidth - (this._style.padding * 2); // Colors canvas has to be square (otherwise, !circle)
		this._ctx.colors = this._canvas.colors.getContext('2d');
    // Init pickers position
    this._picker.colors.x = this._canvas.colors.width / 2;
    this._picker.colors.y = 0;
    this._picker.colors.h = this._canvas.colors.width / 15;
    this._picker.colors.w = this._canvas.colors.width / 62;
    this._picker.colors.a = -90;
    this._picker.light.x = this._canvas.light.width - 1;
    this._picker.light.y = 1;
	}


  /** @method
   * @name _draw
   * @private
   * @memberof RadialPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Internal method to draw each canvas and pickers with proper position, and send
   * an update to the component caller to notify the new selected color.</blockquote> **/
	_draw() {
		// Clear previous canvas' contexts
		this._ctx.colors.clearRect(0, 0, this._canvas.colors.width, this._canvas.colors.height);
		this._ctx.light.clearRect(0, 0, this._canvas.light.width, this._canvas.light.height);
		// Draw circular border
		this._ctx.colors.lineWidth = 1;
	  this._ctx.colors.strokeStyle = this._style.border;
    this._ctx.colors.beginPath();		
    this._ctx.colors.arc(this._canvas.colors.width / 2, this._canvas.colors.height / 2, this._canvas.colors.width / 2, 0, 2 * Math.PI, false);
		this._ctx.colors.stroke();
    this._ctx.colors.closePath();		
		// Then draw the colored circle for color selection
	  for (let angle = 0; angle <= 360; ++angle) {
	    const startAngle = (angle - 2) * Math.PI / 180;
	    const endAngle = angle * Math.PI / 180;
	    this._ctx.colors.beginPath();
	    this._ctx.colors.moveTo(this._canvas.colors.width / 2, this._canvas.colors.height / 2);
	    this._ctx.colors.arc(this._canvas.colors.width / 2, this._canvas.colors.height / 2, this._canvas.colors.width / 2, startAngle, endAngle, false);
	    this._ctx.colors.closePath();
	    this._ctx.colors.fillStyle = `hsl(${angle}, 100%, 50%)`;
	    this._ctx.colors.fill();
	  }
	  // Draw inner border
    this._ctx.colors.beginPath();
    this._ctx.colors.arc(this._canvas.colors.width / 2, this._canvas.colors.height / 2, this._canvas.colors.width / 2 - this._picker.colors.h, 0, 2 * Math.PI, false);
		this._ctx.colors.stroke();
    this._ctx.colors.closePath();
		// Draw inner circle to make color circle a donut only
    this._ctx.colors.beginPath();
    this._ctx.colors.moveTo(this._canvas.colors.width / 2, this._canvas.colors.height / 2);
    this._ctx.colors.arc(this._canvas.colors.width / 2, this._canvas.colors.height / 2, this._canvas.colors.width / 2 - this._picker.colors.h, 0, 2 * Math.PI, false);
    this._ctx.colors.closePath();
    this._ctx.colors.fillStyle = this._style.bg;
    this._ctx.colors.fill();  
		// Color gradient with white from left to right
		const pickedColor = this._getPickedColor();
		let gradient = this._ctx.light.createLinearGradient(0, 0, this._canvas.light.width, 0);
		gradient.addColorStop(0.05, 'rgb(255, 255, 255)');
		gradient.addColorStop(0.98, `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`);
		this._ctx.light.fillStyle = gradient;
		this._ctx.light.fillRect(0, 0, this._canvas.light.width, this._canvas.light.height);
		// Color gradient with black from top to bottom
		gradient = this._ctx.light.createLinearGradient(0, 0, 0, this._canvas.light.height);
		gradient.addColorStop(0.05, 'rgba(0, 0, 0, 0)');
		gradient.addColorStop(0.98, 'rgb(0, 0, 0)');
		this._ctx.light.fillStyle = gradient;
		this._ctx.light.fillRect(0, 0, this._canvas.light.width, this._canvas.light.height);
		// Color picker around donut
		this._ctx.colors.translate(this._canvas.colors.width / 2, this._canvas.colors.height / 2);
    this._ctx.colors.rotate(this._picker.colors.a * Math.PI / 180);
		this._ctx.colors.beginPath();
		this._ctx.colors.rect(this._canvas.colors.width / 2, 0, - this._picker.colors.h, - this._picker.colors.w);
		this._ctx.colors.closePath();
		this._ctx.colors.rotate(- this._picker.colors.a * Math.PI / 180);
		this._ctx.colors.translate(- this._canvas.colors.width / 2, - this._canvas.colors.height / 2);
		this._ctx.colors.lineWidth = 3;
		this._ctx.colors.strokeStyle = this._style.picker;
		this._ctx.colors.stroke();
		// Light picker
		const pickedLight = this._getPickedLight();
		this._ctx.light.beginPath();
		this._ctx.light.arc(this._picker.light.x, this._picker.light.y, this._picker.light.r, 0, Math.PI * 2);
		this._ctx.light.closePath();
		this._ctx.light.strokeStyle = this._style.picker;
		this._ctx.light.lineWidth = 3;		
		this._ctx.light.fillStyle = `rgb(${pickedLight.r}, ${pickedLight.g}, ${pickedLight.b})`;
		this._ctx.light.fill();
		this._ctx.light.stroke();
		// Send data to callback
		this._onColorChange({
			rgb: pickedLight,
			hsl: Utils.rgb2hsl(pickedLight),
			hsv: Utils.rgb2hsv(pickedLight),
			cmyk: Utils.rgb2cmyk(pickedLight),
			hex: Utils.rgb2hex(pickedLight)
		});
	}


  /** @method
   * @name _mouseDownOnColor
   * @private
   * @memberof RadialPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This method must be overriden from parent class, as color canvas is radial and requires
   * it own computation to determine the picker X, Y and Alpha positions.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseDownOnColor(e) {
		this._isMouseDownOnColor = true;
  	var rect = this._canvas.colors.getBoundingClientRect();
    let deltaX = e.clientX - (rect.left + this._canvas.colors.width / 2);
    let deltaY = e.clientY - (rect.top + this._canvas.colors.height / 2);
    this._picker.colors.a = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
		this._picker.colors.x = (this._canvas.colors.width / 2) * Math.cos(Math.PI * 2 * this._picker.colors.a / 360) + (this._canvas.colors.width / 2);
		this._picker.colors.y = (this._canvas.colors.width / 2) * Math.sin(Math.PI * 2 * this._picker.colors.a / 360) + (this._canvas.colors.width / 2);

		if (this._picker.colors.y < (this._canvas.colors.height / 2)) {
			this._picker.colors.y += this._picker.colors.h / 2;
		} else {
			this._picker.colors.y -= this._picker.colors.h / 2;
		}	

    this._draw();  
	}


  /** @method
   * @name _mouseMoveOnColor
   * @private
   * @memberof RadialPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This method must be overriden from parent class, as color canvas is radial and requires
   * it own computation to determine the picker X, Y and Alpha positions.</blockquote>
   * @param {object} e - The mouse event **/
	_mouseMoveOnColor(e) {
    if (this._isMouseDownOnColor) {
    	var rect = this._canvas.colors.getBoundingClientRect();
      let deltaX = e.clientX - (rect.left + (this._canvas.colors.width / 2));
      let deltaY = e.clientY - (rect.top + (this._canvas.colors.height / 2));
      this._picker.colors.a = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
			this._picker.colors.x = (this._canvas.colors.width / 2) * Math.cos(2 * Math.PI * (this._picker.colors.a / 360)) + (this._canvas.colors.width / 2); 
			this._picker.colors.y = (this._canvas.colors.width / 2) * Math.sin(2 * Math.PI * (this._picker.colors.a / 360)) + (this._canvas.colors.width / 2);

			if (this._picker.colors.x < (this._canvas.colors.width / 2)) {
				this._picker.colors.x += this._picker.colors.h / 2;
			} else {
				this._picker.colors.x -= this._picker.colors.h / 2;
			}

			if (this._picker.colors.y < (this._canvas.colors.height / 2)) {
				this._picker.colors.y += this._picker.colors.h / 2;
			} else {
				this._picker.colors.y -= this._picker.colors.h / 2;
			}	

	    this._draw();
    }
	}


  /** @method
   * @name _onResize
   * @private
   * @memberof RadialPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Callback that re-computes the components dimension on each window resize.</blockquote> **/
	_onResize() {
		if (this._renderTo.offsetWidth <= 80) {
			console.warn('KolorPick : the canvas size is not enough to properly display the radial color picker.');
		}

    this._canvas.light.width = (60 * this._dom.canvasWraper.offsetWidth) / 100 - (this._style.padding * 2);
    this._canvas.light.height = (60 * this._dom.canvasWraper.offsetWidth) / 100 - (this._style.padding * 2); // Colors canvas has to be square (otherwise, !circle)
		this._ctx.light = this._canvas.light.getContext('2d');
		// Setup color canvas
    this._canvas.colors.width = this._dom.canvasWraper.offsetWidth - (this._style.padding * 2);
    this._canvas.colors.height = this._dom.canvasWraper.offsetWidth - (this._style.padding * 2); // Colors canvas has to be square (otherwise, !circle)
		this._ctx.colors = this._canvas.colors.getContext('2d');
    // Init pickers position
    this._picker.colors.x = this._canvas.colors.width / 2;
    this._picker.colors.y = 0;
    this._picker.colors.h = this._canvas.colors.width / 15;
    this._picker.colors.w = this._canvas.colors.width / 62;
    this._picker.colors.a = -90;
    this._picker.light.x = this._canvas.light.width - 1;
    this._picker.light.y = 1;
    // Force redrawing of canvases
    this._draw();
	}


}


export default RadialPicker;
