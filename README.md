# KolorPick

![](https://badgen.net/badge/version/0.1.0/blue)
![License](https://img.shields.io/github/license/ArthurBeaulieu/KolorPick.svg)
![Doc](https://badgen.net/badge/documentation/written/green)
![Test](https://badgen.net/badge/test/wip/orange)
![Dep](https://badgen.net/badge/dependencies/none/green)

A basic color picker, with no dependencies!

[See it live](https://arthurbeaulieu.github.io/KolorPick/demo/example.html) or [Read the documentation](https://arthurbeaulieu.github.io/KolorPick/doc/index.html)

This color picker exists in two flavors : linear or radial. Both require a parent element to be rendered on and a callback to get the formatted color value at any wheel update. To get started, simply include the bundled file in the dist folder and reference it in your project HTML. If you want to bundle it yourself, just reference `src/KolorPick.js` as entry point. You can now access this module using the `window.KolorPick` object to build a color picker.

## Usage 

The color picker can be instanciated as follows ; only `renderTo`, `type` and `onColoChange` arguments are mandatory, other arguments are presented with default values.

```javascript
import KolorPick from 'path/to/KolorPick.bundle.js';

const component = new KolorPick({
	renderTo: document.getElementById('my-element'),
	type: 'linear', // Either linear or radial
	style: {
		bg: 'white', // CSS color for component background
		border: 'black', // CSS color for canvas border
		picking: 'white, // CSS color for pickers
		padding: 20 // Padding size in px to apply
	},
	onColorChange: data => { // Callback method called on each color modification
		/* HEX value in data.hex 
		 * RGB value in data.rgb (each in sub .r, .g and .b)
		 * HSL value in data.hsl (each in sub .h, .s and .l)
		 * HSV value in data.hsv (each in sub .h, .s and .v)
		 * CMYK value in data.cmyk (each in sub .c, .m, .y and .k) */
	}
});
```

This created component can be destroyed at any time when done using ; the `component.destroy()` method will remove the picker from the parent DOM and will remove all its subscribed events.

If you need more information on those components methods and internals, you can read the online [documentation](https://arthurbeaulieu.github.io/KolorPick/doc/).

# Development

If you clone this repository, you can `npm install` to install development dependencies. This will allow you to build dist file, run the component tests or generate the documentation ;

- `npm run build` to generate the minified file ;
- `npm run watch` to watch for any change in source code ;
- `npm run server` to launch a local development server ;
- `npm run test` to perform tests ;
- `npm run test-dev` to debug tests ;
- `npm run doc` to generate documentation ;
- `npm run beforecommit` to perform tests, generate doc and bundle the source files.

To avoid CORS when locally loading the example HTML file, run the web server. Please do not use it on a production environment. Unit tests are performed on both Firefox and Chrome ; ensure you have both installed before running tests, otherwise they might fail.

Kolor Pick 0.1.0 - GPL-3.0 - ArthurBeaulieu
