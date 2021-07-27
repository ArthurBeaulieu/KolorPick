import BaseComponent from '../utils/BaseComponent';
import Utils from '../utils/Utils';


class LinearPicker extends BaseComponent {


	constructor(options) {
		super(options);
		this._type = 'linear';
		// Picker DOM skeleton
		this._dom = {
			wrapper: null,
			picked: null,
			light: null,
			colors: null
		};
		// Picking canvases
		this._canvas = {
			light: null,
			colors: null
		};
		this._ctx = {
			light: null,
			colors: null
		};
		// Pickers for both canvases
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
		// Events internals
		this._isMouseDownOnColor = false;
		this._isMouseDownOnLight = false;
		// Component init sequence
		this._init();
		this._draw();
		this._events();		
	}


	destroy() {
    this._canvas.colors.removeEventListener('mousedown', this._mouseDownOnColor);
    this._canvas.light.removeEventListener('mousedown', this._mouseDownOnLight);
    document.removeEventListener('mousemove', this._mouseMoveOnColor);
    document.removeEventListener('mousemove', this._mouseMoveOnLight);    
    document.removeEventListener('mouseup', this._mouseUp);		
	}


	_init() {
		this._dom.wrapper = document.createElement('DIV');
		this._dom.picked = document.createElement('DIV');
		this._dom.light = document.createElement('DIV');
		this._dom.colors = document.createElement('DIV');

		this._canvas.colors = document.createElement('CANVAS');
		this._canvas.light = document.createElement('CANVAS');

		this._dom.wrapper.appendChild(this._dom.picked);
		this._dom.wrapper.appendChild(this._dom.light);
		this._dom.wrapper.appendChild(this._dom.colors);
		this._renderTo.appendChild(this._dom.wrapper);

		this._dom.wrapper.style.cssText = 'display:grid;grid-template-rows:50px 1fr 50px;height:100%;width:100%;';
		this._dom.picked.style.cssText = 'margin:15px;';
		this._dom.colors.style.cssText = 'align-items:center;display:flex;justify-content:center;';
		this._canvas.light.style.cssText = 'height:100%;width:100%;'

    this._canvas.colors.width = this._dom.colors.offsetWidth - 40;
    this._canvas.colors.height = '20';
    this._dom.colors.appendChild(this._canvas.colors);
		this._ctx.colors = this._canvas.colors.getContext('2d');
    this._ctx.colors.translate(0.5, 0.5);

    this._canvas.light.width = this._dom.light.offsetWidth;
    this._canvas.light.height = this._dom.light.offsetHeight;
    this._dom.light.appendChild(this._canvas.light);
		this._ctx.light = this._canvas.light.getContext('2d');
    this._ctx.light.translate(0.5, 0.5);

    this._picker.colors.x = this._canvas.colors.width / 2;
    this._picker.colors.y = this._canvas.colors.height / 2;
    this._picker.light.x = this._canvas.light.width - 1;
    this._picker.light.y = 1;
	}


	_draw() {
		this._ctx.colors.clearRect(0, 0, this._canvas.colors.width, this._canvas.colors.height);
		this._ctx.light.clearRect(0, 0, this._canvas.light.width, this._canvas.light.height);
				
		let gradient = this._ctx.colors.createLinearGradient(0, 0, this._canvas.colors.width, 0);

		gradient.addColorStop(0.02, 'rgb(255, 0, 0)');
		gradient.addColorStop(0.15, 'rgb(255, 255, 0)');
		gradient.addColorStop(0.33, 'rgb(0, 255, 0)');
		gradient.addColorStop(0.49, 'rgb(0, 255, 255)');
		gradient.addColorStop(0.67, 'rgb(0, 0, 255)');
		gradient.addColorStop(0.84, 'rgb(255, 0, 255)');
		gradient.addColorStop(0.98, 'rgb(255, 0, 0)');

		this._ctx.colors.fillStyle = gradient;
		this._ctx.colors.fillRect(0, 0, this._canvas.colors.width, this._canvas.colors.height);

		// Color gradient with light
		const pickedColor = this._getPickedColor();
		gradient = this._ctx.light.createLinearGradient(0, 0, this._canvas.light.width, 0);
		gradient.addColorStop(0.05, 'rgb(255, 255, 255)');
		gradient.addColorStop(0.98, `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`);

		this._ctx.light.fillStyle = gradient;
		this._ctx.light.fillRect(0, 0, this._canvas.light.width, this._canvas.light.height);

		gradient = this._ctx.light.createLinearGradient(0, 0, 0, this._canvas.light.height);
		gradient.addColorStop(0.05, 'rgba(0, 0, 0, 0)');
		gradient.addColorStop(0.98, 'rgb(0, 0, 0)');

		this._ctx.light.fillStyle = gradient;
		this._ctx.light.fillRect(0, 0, this._canvas.light.width, this._canvas.light.height);

		// Color picker 
		this._ctx.colors.beginPath();
		this._ctx.colors.arc(this._picker.colors.x, this._picker.colors.y, this._picker.colors.r, 0, Math.PI * 2);
		this._ctx.colors.strokeStyle = 'white';
		this._ctx.colors.lineWidth = 3;
		this._ctx.colors.fillStyle = `rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`;
		this._ctx.colors.fill();
		this._ctx.colors.stroke();
		this._ctx.colors.closePath();	

		// Light picker
		const pickedLight = this._getPickedLight();		
		this._ctx.light.beginPath();
		this._ctx.light.arc(this._picker.light.x, this._picker.light.y, this._picker.light.r, 0, Math.PI * 2);
		this._ctx.light.strokeStyle = 'white';
		this._ctx.light.lineWidth = 3;		
		this._ctx.light.fillStyle = `rgb(${pickedLight.r}, ${pickedLight.g}, ${pickedLight.b})`;
		this._ctx.light.fill();
		this._ctx.light.stroke();
		this._ctx.light.closePath();

		this._dom.picked.style.backgroundColor = `rgb(${pickedLight.r}, ${pickedLight.g}, ${pickedLight.b})`;

		this._onColorChange({
			rgb: pickedLight,
			hsl: Utils.rgb2hsl(pickedLight),
			hsv: Utils.rgb2hsv(pickedLight),
			cmyk: Utils.rgb2cmyk(pickedLight),
			hex: Utils.rgb2hex(pickedLight)
		});
	}
	

	_events() {
		// Enforce this binding for proper destruction later on
    this._mouseDownOnColor = this._mouseDownOnColor.bind(this);
    this._mouseMoveOnColor = this._mouseMoveOnColor.bind(this);
    this._mouseDownOnLight = this._mouseDownOnLight.bind(this);
    this._mouseMoveOnLight = this._mouseMoveOnLight.bind(this);
    this._mouseUp = this._mouseUp.bind(this);
    // Subscribe to mouse event to react
    this._canvas.colors.addEventListener('mousedown', this._mouseDownOnColor);
    this._canvas.light.addEventListener('mousedown', this._mouseDownOnLight);
    document.addEventListener('mousemove', this._mouseMoveOnColor);
    document.addEventListener('mousemove', this._mouseMoveOnLight);    
    document.addEventListener('mouseup', this._mouseUp);
	}


	_mouseDownOnColor(e) {
		this._isMouseDownOnColor = true;
    let currentX = e.clientX - this._canvas.colors.offsetLeft;
		this._picker.colors.x = currentX;
    this._draw();    
	}


	_mouseMoveOnColor(e) {
    if (this._isMouseDownOnColor) {
      let currentX = e.clientX - this._canvas.colors.offsetLeft;
      
      if (currentX >= this._canvas.colors.width) {
      	currentX = this._canvas.colors.width - 1;
      } else if (currentX <= 0) {
      	currentX = 1;
      }

      this._picker.colors.x = currentX;
	    this._draw();
    }
	}


	_mouseDownOnLight(e) {
		this._isMouseDownOnLight = true;
    let currentX = e.clientX - this._canvas.light.offsetLeft;
    let currentY = e.clientY - this._canvas.light.offsetTop;
		this._picker.light.x = currentX;
		this._picker.light.y = currentY;

    this._draw(); 
	}


	_mouseMoveOnLight(e) {
    if (this._isMouseDownOnLight) {
      let currentX = e.clientX - this._canvas.light.offsetLeft;
      let currentY = e.clientY - this._canvas.light.offsetTop;

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


	_mouseUp() {
		this._isMouseDownOnColor = false;
		this._isMouseDownOnLight = false;
	}


	_getPickedColor() {
		return Utils.getPickedPixelOnCtx(this._ctx.colors, this._picker.colors);
	}


	_getPickedLight() {
		return Utils.getPickedPixelOnCtx(this._ctx.light, this._picker.light);
	}


}


export default LinearPicker;
