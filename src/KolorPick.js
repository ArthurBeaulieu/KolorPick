import LinearPicker from './components/LinearPicker';
import RadialPicker from './components/RadialPicker';


const KolorPickVersion = '0.9.8';


class KolorPick {


  /** @summary KolorPick entry class to create a color picker ready to use
   * @author Arthur Beaulieu
   * @since 2021
   * @description <blockquote></blockquote>
   * @param {object} options - The color picker definition
   * @param {string} options.type -  */
	constructor(options) {
		if (options.type === 'linear') {
			return new LinearPicker(options);
		} else if (options.type === 'radial') {
			return new RadialPicker(options);
		}
	}


  /** @public
   * @member {string} - The AudioVisualizer component version */
  static get version() {
    return KolorPickVersion;
  }	

	
}


// Global scope attachment will be made when bundling this file
window.KolorPick = KolorPick;
export default KolorPick;
