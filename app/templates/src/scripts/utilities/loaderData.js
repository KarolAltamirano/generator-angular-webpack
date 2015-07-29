var data     = require('../data/loader.json'),
    isRetina = window.devicePixelRatio > 1;

if (isRetina) {
    data.push({ id: 'assets-css', src: 'css/assets/assets-retina.css' });
} else {
    data.push({ id: 'assets-css', src: 'css/assets/assets-no-retina.css' });
}

module.exports = data;
