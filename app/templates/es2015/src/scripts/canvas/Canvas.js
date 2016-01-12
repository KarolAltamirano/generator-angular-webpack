'use strict';

var Plane = require('./Plane');

class Canvas {
    constructor(canvas) {
        var scale = window.devicePixelRatio || 1,
            canvasElement = document.getElementById(canvas);

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
        requestAnimationFrame(() => {
            this.animate();
        });
    }

    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });

        this.renderer.render(this.container);
    }

    onResize() {
        window.addEventListener('resize', () => {
            // resize renderer
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.renderer.view.style.width = this.width + 'px';
            this.renderer.view.style.height = this.height + 'px';

            this.renderer.resize(this.width, this.height);

            this.positionElementsOnResize();
        });
    }

    createElements() {
        this.spritePlane = new Plane(this.renderer.resolution);
        this.spritePlane.position.x = this.width / 2;
        this.spritePlane.position.y = this.height / 2;

        this.container.addChild(this.spritePlane);
    }

    positionElementsOnResize() {
        this.spritePlane.position.x = this.width / 2;
        this.spritePlane.position.y = this.height / 2;
    }
}

module.exports = Canvas;
