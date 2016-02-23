import PIXI from 'pixi.js';
import loader from '../utilities/loader';

/**
 * Plane class - Create plane object
 *
 * @param  {number} resolution - Device Pixel Ratio
 */
export default class Plane extends PIXI.Sprite {
    constructor(resolution) {
        var planeImg = loader.getLoader('main').getResult('plane'),
            planeBase = new PIXI.BaseTexture(planeImg),
            planeTexture = new PIXI.Texture(planeBase),
            scale = resolution > 1 ? 0.5 : 1;

        super(planeTexture);

        this.scale = new PIXI.Point(scale, scale);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
}
