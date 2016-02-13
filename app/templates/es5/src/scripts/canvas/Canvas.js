'use strict';

var PIXI = require('pixi.js'),
    Plane = require('./Plane');

/**
 * Canvas class - Create canvas
 *
 * @param  {string} canvas - Id of <canvas> html element
 */
function Canvas(canvas) {
    var scale = window.devicePixelRatio || 1,
        canvasElement = document.getElementById(canvas),
        _this = this;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    canvasElement.style.width = this.width + 'px';
    canvasElement.style.height = this.height + 'px';

    this.container = new PIXI.Container();

    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
        view: canvasElement,
        resolution: scale
    });

    this.renderer.backgroundColor = 0xFFFFFF;

    this.createElements();

    // register on resize callback
    this.onResize();

    // run animation
    requestAnimationFrame(function () {
        _this.animate();
    });
}

/**
 * Create canvas objects
 */
Canvas.prototype.createElements = function () {
    this.spritePlane = new Plane(this.renderer.resolution);
    this.spritePlane.position.x = this.width / 2;
    this.spritePlane.position.y = this.height / 2;

    this.container.addChild(this.spritePlane);
};

/**
 * Canvas animation loop
 */
Canvas.prototype.animate = function () {
    var _this = this;

    requestAnimationFrame(function () {
        _this.animate();
    });

    this.renderer.render(this.container);
};

/**
 * Handle canvas resize
 */
Canvas.prototype.onResize = function () {
    window.addEventListener('resize', function () {
        // resize renderer
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.renderer.view.style.width = this.width + 'px';
        this.renderer.view.style.height = this.height + 'px';

        this.renderer.resize(this.width, this.height);

        this.positionElementsOnResize();
    }.bind(this));
};

/**
 * Position objects on canvas resize
 */
Canvas.prototype.positionElementsOnResize = function () {
    this.spritePlane.position.x = this.width / 2;
    this.spritePlane.position.y = this.height / 2;
};

module.exports = Canvas;
