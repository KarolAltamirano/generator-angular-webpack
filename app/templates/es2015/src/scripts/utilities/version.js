import versionJson from '../data/version.json';
import appSettings from './appSettings';

/**
 * Print version info
 */
var version = function () {
    var el;

    if (!appSettings.renderVersionInfo) {
        return;
    }

    // print version to console
    if (console && console.log) {
        console.log(
            '\n%cv' + versionJson.version + '%c %c' + versionJson.time + '%c\n\n',
            'color: #ffffff; background: #00aa00; padding: 1px 5px;',
            'color: #ffffff; background: #d1eeee; padding: 1px 5px;',
            'color: #ffffff; background: #00aa00; padding: 1px 5px;',
            'background: #ffffff;'
        );
    }

    // print version to page
    el = document.createElement('div');
    el.className = 'version';
    el.innerHTML = (
        '<div class="version">' +
            'v' + versionJson.version + ' <span>| ' + versionJson.time + '</span>' +
        '</div>'
    );

    document.body.appendChild(el);
};

export default version;
