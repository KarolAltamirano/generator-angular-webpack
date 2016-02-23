var load = require.context('./', false, /^[^_]+\.js$/);

load.keys().forEach(load);

export default 'mServices';
