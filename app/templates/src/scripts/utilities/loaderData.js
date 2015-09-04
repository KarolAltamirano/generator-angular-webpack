var dataNoRetina = require('../data/loader-no-retina.json'),
    dataRetina   = require('../data/loader-retina.json'),
    isRetina = window.devicePixelRatio > 1,
    data;

if (isRetina) {
    data = dataRetina;
    data.push({ id: 'assets-css', src: 'css/assets/assets-retina.css' });
} else {
    data = dataNoRetina;
    data.push({ id: 'assets-css', src: 'css/assets/assets-no-retina.css' });
}

module.exports = data;
