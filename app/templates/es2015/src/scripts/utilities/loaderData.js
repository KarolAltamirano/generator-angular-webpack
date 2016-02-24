import dataCommon from '../data/loader-common.json';
import dataNoRetina from '../data/loader-no-retina.json';
import dataRetina from '../data/loader-retina.json';

var isRetina = window.devicePixelRatio > 1,
    data;

if (isRetina) {
    data = dataCommon.concat(dataRetina);
    data.push({ id: 'assets-css', src: 'css/assets/assets-retina.css' });
} else {
    data = dataCommon.concat(dataNoRetina);
    data.push({ id: 'assets-css', src: 'css/assets/assets-no-retina.css' });
}

export default data;
