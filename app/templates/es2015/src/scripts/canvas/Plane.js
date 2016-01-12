'use strict';

var  loader = require('../utilities/loader');

class Plane extends PIXI.Sprite {
    constructor(resolution) {
        var planeImg  = loader.getLoader().getResult('plane'),
            planeBase = new PIXI.BaseTexture(planeImg),
            planeTexture = new PIXI.Texture(planeBase),
            scale = resolution > 1 ? 0.5 : 1;

        super(planeTexture);

        this.scale = new PIXI.Point(scale, scale);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
}

module.exports = Plane;
