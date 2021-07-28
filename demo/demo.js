const linearColorPicker = new KolorPick({
	renderTo: document.getElementById('test-container-linear'),
	type: 'linear',
	style: {
		bg: 'rgb(33, 33, 33)',
		border: 'rgb(255, 0, 0)',
		picker: 'rgb(0, 255, 255)',
		padding: 20
	},
	onColorChange: data => {
		document.getElementById('linear-feedback').innerHTML = `
			Hex: <b>${data.hex}</b><br>
			RGB: <b>${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}</b><br>
			HSL: <b>${data.hsl.h}, ${data.hsl.s}, ${data.hsl.l}</b><br>
			HSV: <b>${data.hsv.h}, ${data.hsv.s}, ${data.hsv.v}</b><br>
			CMYK: <b>${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}</b>
		`;
	}
});

const radialColorPicker = new KolorPick({
	renderTo: document.getElementById('test-container-radial'),
	type: 'radial',
	style: {
		bg: 'rgb(66, 66, 66)',
		border: 'rgb(0, 255, 0)',
		picker: 'rgb(255, 255, 0)',
		padding: 10
	},
	onColorChange: data => {
		document.getElementById('radial-feedback').innerHTML = `
			Hex: <b>${data.hex}</b><br>
			RGB: <b>${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}</b><br>
			HSL: <b>${data.hsl.h}, ${data.hsl.s}, ${data.hsl.l}</b><br>
			HSV: <b>${data.hsv.h}, ${data.hsv.s}, ${data.hsv.v}</b><br>
			CMYK: <b>${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}</b>
		`;
	}
});
