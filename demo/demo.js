let picker = new KolorPick({
	renderTo: document.getElementById('test-container-linear'),
	type: 'linear',
	style: {
		bg: 'rgb(66, 66, 66)',
		border: 'rgb(127, 127, 127)'
	},
	onColorChange: data => {
		console.log(data);
		document.getElementById('linear-feedback').innerHTML = `
			Hex: <b>${data.hex}</b><br>
			RGB: <b>${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}</b><br>
			HSL: <b>${data.hsl.h}, ${data.hsl.s}, ${data.hsl.l}</b><br>
			HSV: <b>${data.hsv.h}, ${data.hsv.s}, ${data.hsv.v}</b><br>
			CMYK: <b>${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}</b>
		`;
	}
});

document.getElementById('linear-pick').addEventListener('click', () => {
	picker.destroy();
	document.getElementById('linear-pick').classList.add('selected');
	document.getElementById('radial-pick').classList.remove('selected');
	document.getElementById('test-container-radial').style.display = 'none';
	document.getElementById('radial-feedback').style.display = 'none';
	document.getElementById('test-container-linear').style.display = 'inherit';
	document.getElementById('linear-feedback').style.display = 'block';
	picker = new KolorPick({
		renderTo: document.getElementById('test-container-linear'),
		type: 'linear',
		style: {
			bg: 'rgb(66, 66, 66)',
			border: 'rgb(127, 127, 127)'
		},
		onColorChange: data => {
			console.log(data);
			document.getElementById('linear-feedback').innerHTML = `
				Hex: <b>${data.hex}</b><br>
				RGB: <b>${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}</b><br>
				HSL: <b>${data.hsl.h}, ${data.hsl.s}, ${data.hsl.l}</b><br>
				HSV: <b>${data.hsv.h}, ${data.hsv.s}, ${data.hsv.v}</b><br>
				CMYK: <b>${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}</b>
			`;
		}
	});
});

document.getElementById('radial-pick').addEventListener('click', () => {
	picker.destroy();
	document.getElementById('radial-pick').classList.add('selected');
	document.getElementById('linear-pick').classList.remove('selected');	
	document.getElementById('test-container-linear').style.display = 'none';
	document.getElementById('linear-feedback').style.display = 'none';
	document.getElementById('test-container-radial').style.display = 'inherit';
	document.getElementById('radial-feedback').style.display = 'block';
	picker = new KolorPick({
		renderTo: document.getElementById('test-container-radial'),
		type: 'radial',
		style: {
			bg: 'rgb(66, 66, 66)',
			border: 'rgb(127, 127, 127)'
		},
		onColorChange: data => {
			console.log(data);
			document.getElementById('radial-feedback').innerHTML = `
				Hex: <b>${data.hex}</b><br>
				RGB: <b>${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}</b><br>
				HSL: <b>${data.hsl.h}, ${data.hsl.s}, ${data.hsl.l}</b><br>
				HSV: <b>${data.hsv.h}, ${data.hsv.s}, ${data.hsv.v}</b><br>
				CMYK: <b>${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}</b>
			`;
		}
	});
});
