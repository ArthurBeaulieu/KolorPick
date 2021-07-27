class Utils {


	constructor() {}


	static getPickedPixelOnCtx(ctx, picker) {
		//Get the Image Data (pixel value) pointed by the circle by using it's current position
    //getImageData returns an object that has the pixel data (1, 1) is for getting only one pixel.
		let imageData = ctx.getImageData(picker.x, picker.y, 1, 1);
    //Return back an object has the RGB color value of the pointed pixel.
    //The data is an array holds the red, green, blue and alpha values of the current pixel 
		return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
	}


	static rgb2hsl(rgb) {
		const r = rgb.r / 255;
		const g = rgb.g / 255;
		const b = rgb.b / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
	      case r: 
	      	h = (g - b) / d + (g < b ? 6 : 0);
	      	break;
	      case g:
		      h = (b - r) / d + 2;
		      break;
	      case b:
		      h = (r - g) / d + 4;
		      break;
      }
      h /= 6;
    }
    return {h: h * 360, s: s * 100, l: l * 100};
  }


	static rgb2hsv(rgb) {
		const r = rgb.r / 255;
		const g = rgb.g / 255;
		const b = rgb.b / 255;

	  var max = Math.max(r, g, b), min = Math.min(r, g, b);
	  var h, s, v = max;

	  var d = max - min;
	  s = max == 0 ? 0 : d / max;

	  if (max == min) {
	    h = 0; // achromatic
	  } else {
	    switch (max) {
	      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	      case g: h = (b - r) / d + 2; break;
	      case b: h = (r - g) / d + 4; break;
	    }

	    h /= 6;
	  }

	  return { h: h * 360, s: s * 100, v: v * 100 };
	}


  static rgb2cmyk(rgb) {
		if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
		  computedK = 1;
		  return { c: 0, m: 0, y: 0, k: 1 };
		}

		var computedC = 0;
		var computedM = 0;
		var computedY = 0;
		var computedK = 0;

		computedC = 1 - (rgb.r/255);
		computedM = 1 - (rgb.g/255);
		computedY = 1 - (rgb.b/255);

		var minCMY = Math.min(computedC, Math.min(computedM, computedY));
		computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
		computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
		computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
		computedK = Math.round(minCMY * 100);

		return { c: computedC, m: computedM, y: computedY, k: computedK };
	}


	static rgb2hex(rgb) {
		const int2hex = num => {
		  var hex = num.toString(16);
	  	return hex.length == 1 ? '0' + hex.toUpperCase() : hex.toUpperCase();
		};

		return `#${int2hex(rgb.r)}${int2hex(rgb.g)}${int2hex(rgb.b)}`;
	}	


}


export default Utils;
