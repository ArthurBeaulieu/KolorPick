import LinearPicker from './components/LinearPicker';
import RadialPicker from './components/RadialPicker';


const KolorPickVersion = '0.0.1';


class KolorPick {


  /** @summary KolorPick entry class to create a color picker ready to use
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote>This factory wraps both linear and radial color pickers. It offers
   * a visual component build with canvas to select a color and returns it through a callback to the caller.</blockquote>
   * @param {object} options - The color picker definition
   * @param {string} options.type - The picker type in 'linear' or 'radial'
   * @param {object} options.renderTo - The HTMl DOM element to render the picker in
   * @param {function} options.onColorChange - The callback to be called each time a color is selected */
	constructor(options) {
		if (options.type === 'linear') {
			return new LinearPicker(options);
		} else if (options.type === 'radial') {
			return new RadialPicker(options);
		}
	}


  /** @public
   * @member {string} - The KolorPick component version */
  static get version() {
    return KolorPickVersion;
  }	

	
}


// Global scope attachment will be made when bundling this file
window.KolorPick = KolorPick;
export default KolorPick;
