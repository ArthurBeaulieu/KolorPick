import BaseComponent from '../utils/BaseComponent';
import Utils from '../utils/Utils';


class LinearPicker extends BaseComponent {


  /** @summary Classical linear color picker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This class will build a linear color picker, containing a slider to
   * select a color, and a light picker to alter this selected color to lighten or darken it.</blockquote>
   * @param {object} options - The color picker definition
   * @param {object} options.renderTo - The HTMl DOM element to render the picker in
   * @param {function} options.onColorChange - The callback to be called each time a color is selected */
	constructor(options) {
		super('linear', options);
    /** @private
     * @member {object} - Component DOM skeleton */
		this._dom = {
			wrapper: null
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
				r: 8
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
   * @memberof LinearPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Method to initialize the component DOM and variables, to be ready to be then built.</blockquote> **/
	_init() {
		// Create DOM elements		
		this._dom.wrapper = document.createElement('DIV');
		this._canvas.colors = document.createElement('CANVAS');
		this._canvas.light = document.createElement('CANVAS');
		// Chain DOM elements
    this._dom.wrapper.appendChild(this._canvas.light);
    this._dom.wrapper.appendChild(this._canvas.colors);
		this._renderTo.appendChild(this._dom.wrapper);
		// Set DOM elements style
		this._dom.wrapper.style.cssText = `background-color:${this._style.bg};display:grid;grid-template-rows:1fr ${(this._style.padding * 2) + 2}px;height:100%;padding:20px;width:100%;`;
		this._canvas.colors.style.cssText = `border:solid 1px ${this._style.border};margin-top:${this._style.padding}px;`;
		this._canvas.light.style.cssText = `border:solid 1px ${this._style.border};height:100%;width:100%;`;
    // Force height to be locked at initial height
		this._dom.wrapper.style.maxHeight = `${this._renderTo.offsetHeight}px`;
		// Setup light canvas
    this._canvas.light.width = this._dom.wrapper.offsetWidth - (this._style.padding * 2) - 2;
    this._canvas.light.height = this._dom.wrapper.offsetHeight - (this._style.padding * 2) - (this._style.padding * 2) - 2;
		this._ctx.light = this._canvas.light.getContext('2d');
    this._ctx.light.translate(0.5, 0.5);
    // Setup color canvas
    this._canvas.colors.width = this._dom.wrapper.offsetWidth - (this._style.padding * 2) - 2;
    this._canvas.colors.height = `${this._style.padding}`;
		this._ctx.colors = this._canvas.colors.getContext('2d');
    this._ctx.colors.translate(0.5, 0.5);
    // Init pickers position
    this._picker.colors.x = this._canvas.colors.width / 2;
    this._picker.colors.y = this._canvas.colors.height / 2;
    this._picker.light.x = this._canvas.light.width - 1;
    this._picker.light.y = 1;
	}


  /** @method
   * @name _draw
   * @private
   * @memberof LinearPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Internal method to draw each canvas and pickers with proper position, and send
   * an update to the component caller to notify the new selected color.</blockquote> **/
	_draw() {
		// Clear previous canvas' contexts
		this._ctx.colors.clearRect(0, 0, this._canvas.colors.width, this._canvas.colors.height);
		this._ctx.light.clearRect(0, 0, this._canvas.light.width, this._canvas.light.height);
		// Create linear gradient for colors in spectrum from red to red
		let gradient = this._ctx.colors.createLinearGradient(0, 0, this._canvas.colors.width, 0);
		gradient.addColorStop(0.02, 'rgb(255, 0, 0)');
		gradient.addColorStop(0.15, 'rgb(255, 255, 0)');
		gradient.addColorStop(0.33, 'rgb(0, 255, 0)');
		gradient.addColorStop(0.49, 'rgb(0, 255, 255)');
		gradient.addColorStop(0.67, 'rgb(0, 0, 255)');
		gradient.addColorStop(0.84, 'rgb(255, 0, 255)');
		gradient.addColorStop(0.98, 'rgb(255, 0, 0)');
		// Apply gradient to color canvas
		this._ctx.colors.fillStyle = gradient;
		this._ctx.colors.fillRect(0, 0, this._canvas.colors.width, this._canvas.colors.height);
		// Color gradient with white from left to right
		const pickedColor = this._getPickedColor();
		gradient = this._ctx.light.createLinearGradient(0, 0, this._canvas.light.width, 0);
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
		// Color picker 
		this._ctx.colors.beginPath();
		this._ctx.colors.arc(this._picker.colors.x, this._picker.colors.y, this._picker.colors.r, 0, Math.PI * 2);
		this._ctx.colors.strokeStyle = this._style.picker;
		this._ctx.colors.lineWidth = 3;
		this._ctx.colors.fillStyle = `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`;
		this._ctx.colors.fill();
		this._ctx.colors.stroke();
		this._ctx.colors.closePath();
		// Light picker
		const pickedLight = this._getPickedLight();		
		this._ctx.light.beginPath();
		this._ctx.light.arc(this._picker.light.x, this._picker.light.y, this._picker.light.r, 0, Math.PI * 2);
		this._ctx.light.strokeStyle = this._style.picker;
		this._ctx.light.lineWidth = 3;		
		this._ctx.light.fillStyle = `rgb(${pickedLight.r}, ${pickedLight.g}, ${pickedLight.b})`;
		this._ctx.light.fill();
		this._ctx.light.stroke();
		this._ctx.light.closePath();
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
   * @name _onResize
   * @private
   * @memberof LinearPicker
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Callback that re-computes the components dimension on each window resize.</blockquote> **/
  _onResize() {
		if (this._renderTo.offsetWidth <= 80) {
			console.warn('KolorPick : the canvas size is not enough to properly display the linear color picker.');
		}

    // Setup light canvas
    this._canvas.light.width = this._dom.wrapper.offsetWidth - (this._style.padding * 2) - 2;
    this._canvas.light.height = this._dom.wrapper.offsetHeight - (this._style.padding * 2) - (this._style.padding * 2) - 2;
    // Setup color canvas
    this._canvas.colors.width = this._dom.wrapper.offsetWidth - (this._style.padding * 2) - 2;
    this._canvas.colors.height = `${this._style.padding}`;
    // Force pickers position to avoid them to go out of range
    this._picker.colors.x = this._canvas.colors.width / 2;
    this._picker.colors.y = this._canvas.colors.height / 2;
    this._picker.light.x = this._canvas.light.width - 1;
    this._picker.light.y = 1;
    // Force redrawing of canvases
    this._draw();
  }	


}


export default LinearPicker;
