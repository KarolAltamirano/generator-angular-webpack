'use strict';

var  loader = require('../utilities/loader');

function Plane(resolution) {
    var planeImg  = loader.getLoader().getResult('plane'),
        planeBase = new PIXI.BaseTexture(planeImg),
        planeTexture = new PIXI.Texture(planeBase),
        scale = resolution > 1 ? 0.5 : 1;

    PIXI.Sprite.call(this, planeTexture);

    this.scale = new PIXI.Point(scale, scale);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
}

Plane.prototype = Object.create(PIXI.Sprite.prototype);
Plane.prototype.constructor = Plane;

module.exports = Plane;
