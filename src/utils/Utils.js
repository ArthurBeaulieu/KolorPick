class Utils {


	constructor() {

	}


	static getPickedPixelOnCtx(ctx, picker) {
		//Get the Image Data (pixel value) pointed by the circle by using it's current position
    //getImageData returns an object that has the pixel data (1, 1) is for getting only one pixel.
		let imageData = ctx.getImageData(picker.x, picker.y, 1, 1);
    //Return back an object has the RGB color value of the pointed pixel.
    //The data is an array holds the red, green, blue and alpha values of the current pixel 
		return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
	}


	static int2hex(num) {
	  var hex = num.toString(16);
  	return hex.length == 1 ? "0" + hex.toUpperCase() : hex.toUpperCase();
	}


	static rgb2hsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
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
    return {h: h, s: s, l: l};
  }

  
}


export default Utils;
