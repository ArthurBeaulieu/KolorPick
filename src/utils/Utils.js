class Utils {


	/** @summary Utils provides miscelaneous useful methods
   * @author Arthur Beaulieu
   * @since 2020
   * @description <blockquote>This class doesn't need to be instantiated, as all its methods are static in order to
   * make those utils methods available without constraints. Refer to each method for their associated documentation.
   * This class contains several methods to manipulate canvas' contexts or make color conversions.</blockquote> */
	constructor() {}


	/** @method
   * @name getPickedPixelOnCtx
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Fill context with radial gradient according to options object.</blockquote>
   * @param {object} ctx - The canvas context to extract color from
   * @param {object} picker - A picker object containing X and Y position
   * @param {object} picker.x - The pixel X position to study
   * @param {object} picker.y - The pixel Y position to study
   * @return {object} An object containing RGB values for pixel color under picker position **/
	static getPickedPixelOnCtx(ctx, picker) {
		const imageData = ctx.getImageData(picker.x, picker.y, 1, 1);
		return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
	}


	/** @method
   * @name rgb2hsl
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Convert a RGB color to HSL. Inspired and edited from mjackson/color-conversion-algorithms.js gist
   * -> https://gist.github.com/mjackson/5311256</blockquote>
   * @param {object} rgb - An object containing the RGB values to convert
   * @return {object} An object containing HSL values for RGB input color **/
	static rgb2hsl(rgb) {
		const r = rgb.r / 255;
		const g = rgb.g / 255;
		const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max === min) { // Achromatic
      h = s = 0;
    } else {
      const d = max - min;
      s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
      switch (max) {
	      case r: 
	      	h = (g - b) / d + ((g < b) ? 6 : 0);
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

    return {
    	h: Utils.precisionRound(h * 360, 2),
    	s: Utils.precisionRound(s * 100, 2),
    	l: Utils.precisionRound(l * 100, 2)
    };
  }


	/** @method
   * @name rgb2hsv
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Convert a RGB color to HSV. Inspired and edited from mjackson/color-conversion-algorithms.js gist
   * -> https://gist.github.com/mjackson/5311256</blockquote>
   * @param {object} rgb - An object containing the RGB values to convert
   * @return {object} An object containing HSV values for RGB input color **/
	static rgb2hsv(rgb) {
		const r = rgb.r / 255;
		const g = rgb.g / 255;
		const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
	  const d = max - min;
    let h = 0;
    let s = 0;
    let v = max;

	  s = (max === 0) ? 0 : (d / max);

	  if (max === min) { // Achromatic
	    h = 0;
	  } else {
	    switch (max) {
	      case r:
	      	h = (g - b) / d + ((g < b) ? 6 : 0);
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

	  return {
	  	h: Utils.precisionRound(h * 360, 2),
	  	s: Utils.precisionRound(s * 100, 2),
	  	v: Utils.precisionRound(v * 100, 2)
	  };
	}


	/** @method
   * @name rgb2cmyk
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Convert a RGB color to CMYK. Inspired and edited from mjackson/color-conversion-algorithms.js gist
   * -> https://gist.github.com/mjackson/5311256</blockquote>
   * @param {object} rgb - An object containing the RGB values to convert
   * @return {object} An object containing CMYK values for RGB input color **/
  static rgb2cmyk(rgb) {
		if (rgb.r === 0 && rgb.g === 0 && rgb.b === 0) {
		  computedK = 1;
		  return { c: 0, m: 0, y: 0, k: 1 };
		}

		let computedC = 1 - (rgb.r / 255);
		let computedM = 1 - (rgb.g / 255);
		let computedY = 1 - (rgb.b / 255);
		let computedK = 0;
		const minCMY = Math.min(computedC, Math.min(computedM, computedY));

		computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
		computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
		computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
		computedK = Math.round(minCMY * 100);

		return { c: computedC, m: computedM, y: computedY, k: computedK };
	}


	/** @method
   * @name rgb2hex
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Convert a RGB color to HEX. Inspired and edited from mjackson/color-conversion-algorithms.js gist
   * -> https://gist.github.com/mjackson/5311256</blockquote>
   * @param {object} rgb - An object containing the RGB values to convert
   * @return {object} An object containing HEX values for RGB input color **/
	static rgb2hex(rgb) {
		const int2hex = num => {
		  const hex = num.toString(16);
	  	return (hex.length === 1) ? '0' + hex.toUpperCase() : hex.toUpperCase();
		};

		return `#${int2hex(rgb.r)}${int2hex(rgb.g)}${int2hex(rgb.b)}`;
	}	


	/** @method
   * @name precisionRound
   * @public
   * @memberof Utils
   * @static
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>Round a floating number with a given precision after coma.</blockquote>
   * @param {number} value - The floating value to round
   * @param {number} precision - The amount of number we want to have after floating point
   * @return {number} The rounded value **/
  static precisionRound(value, precision) {
    // Test that caller sent mandatory arguments
    if ((value === undefined || value === null) || (precision === undefined || precision === null)) {
      return new Error('Utils.precisionRound : Missing arguments value or precision');
    }
    // Test those arguments proper types
    if (typeof value !== 'number' || typeof precision !== 'number') {
      return new Error('Utils.precisionRound : Invalid type for value or precision');
    }
    // Perform method purpose    
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }


}


export default Utils;
