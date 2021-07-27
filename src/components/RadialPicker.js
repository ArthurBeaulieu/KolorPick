import BaseComponent from '../utils/BaseComponent';


class RadialPicker extends BaseComponent {


	constructor(options) {
		super(options);
		this._type = 'radial';

		this._canvas = null;
		this._ctx = null;

		this._dom = {
			wrapper: null,
			info: null,
			picked: null
		};

		this._picked = {
			x: 0,
			y: 0,
			r: 7
		};

		this._init();
		this._draw();
	}


	_init() {
		this._canvas = document.createElement('CANVAS');
    this._canvas.width = this._renderTo.offsetWidth - 2;
    this._canvas.height = this._renderTo.offsetHeight - 2;
    this._canvas.style.cssText = 'background-color:black;border:solid 1px #2c2c30;display:block;box-sizing:border-box;';   

    this._picked.x = this._canvas.width / 2;
    this._picked.y = this._canvas.height / 2;

		this._dom.wrapper = document.createElement('DIV');
		this._dom.info = document.createElement('DIV');
		this._dom.picked = document.createElement('DIV');

		this._dom.wrapper.appendChild(this._canvas);
		this._dom.info.appendChild(this._dom.picked);
		this._dom.wrapper.appendChild(this._dom.info);

		this._renderTo.appendChild(this._dom.wrapper);

		this._ctx = this._canvas.getContext('2d');
    this._ctx.translate(0.5, 0.5);		
	}


	_draw() {
		// draw colors
		var radius = this._canvas.width / 2;
	  var counterClockwise = false;

	  for(var angle=0; angle<=360; angle+=1){
	    var startAngle = (angle-2)*Math.PI/180;
	    var endAngle = angle * Math.PI/180;
	    this._ctx.beginPath();
	    this._ctx.moveTo(this._canvas.width / 2, this._canvas.height / 2);
	    this._ctx.arc(this._canvas.width / 2, this._canvas.height / 2, radius-1, startAngle, endAngle, counterClockwise);
	    this._ctx.closePath();
	    this._ctx.fillStyle = 'hsl('+angle+', 100%, 50%)';
	    this._ctx.fill();
	  }

		// Draw black/white

/*	  var gradient = this._ctx.createRadialGradient(
	  	this._canvas.width / 2, this._canvas.height / 2, 0, 
	  	this._canvas.width / 2, this._canvas.height / 2, radius
	  );

    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');   
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

	  this._ctx.arc(this._canvas.width / 2, this._canvas.height / 2, radius, (0-2)*Math.PI/180,  360 * Math.PI/180);
	  this._ctx.fillStyle = gradient;
	  this._ctx.fill();*/

		this._drawPicker();
	}


	_drawPicker() {
		//Circle 
		this._ctx.beginPath();
		//Arc renders a circle depending on the position, radius and arc
		this._ctx.arc(this._picked.x, this._picked.y, this._picked.r, 0, Math.PI * 2);
		//Render it in black but not fill (only stroke)
		this._ctx.strokeStyle = "black";
		//Render the circle stroke and close the rendering path
		this._ctx.stroke();
		this._ctx.closePath();			
	}	


}


export default RadialPicker;
