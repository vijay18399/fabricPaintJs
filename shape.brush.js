(function (global) {
    'use strict';

    if (fabric.ShapeBrush) {
        fabric.warn('fabric.ShapeBrush is already defined');
        return;
    }

    fabric.ShapeBrush = fabric.util.createClass(fabric.BaseBrush, {
        type: 'shapeBrush',
        initialize: function (canvas) {
            this.maincanvas = canvas;
            this.canvas = this.maincanvas.lowerCanvasEl;
            this.ctx = this.canvas.getContext('2d');
            this.shape = null;
            this.object = null;
            this.startPoint = null;
            this.isDown = false;
        },
        setShape: function (shape) {
            this.shape = shape;
        },
        onMouseDown: function (pointer) {
            this.isDown = true;
            this.startPoint = pointer;
            this.createObject(pointer);
        },
        onMouseMove: function (pointer, options) {
            this.updateObject(pointer);
        },
        onMouseUp: function (event) {
            this.isDown = false;
            this.finalizeObject();
        },
        createObject: function (pointer) {
            switch (this.shape) {
                case 'circle':
                    this.object = new fabric.Circle({
                        radius: 0,
                        left: pointer.x,
                        top: pointer.y,
                        fill: 'transparent',
                        stroke: this.color,
                        strokeWidth: this.width
                    });
                    break;
                case 'square':
                    this.object = new fabric.Rect({
                        left: pointer.x,
                        top: pointer.y,
                        width: 0,
                        height: 0,
                        fill: 'transparent',
                        stroke: this.color,
                        strokeWidth: this.width
                    });
                    break;
                case 'ellipse':
                    this.object = new fabric.Ellipse({
                          left: pointer.x,
                           top: pointer.y,
                           stroke:  this.color,
                           originX: 'left',
                           originY: 'top',
                           strokeWidth: this.width,
                           rx: 0,
                           ry: 0,
                           fill:'transparent'
                     });
                     break;
                case 'line':
                       this.object = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                           stroke:  this.color,
                           fill:'transparent',
                           strokeWidth: this.width
                         })
                      break;
                case 'triangle':
                    this.object = new fabric.Triangle({
                        left: pointer.x,
                        top: pointer.y,
                        fill: 'transparent',
                        stroke: this.color,
                        strokeWidth: this.width,
                        width: 0,
                        height: 0
                    });
                    break;
                case 'pentagon':
                    this.object = this.createPolygon(5, pointer.x, pointer.y);
                    break;
                case 'rhombus':
                    this.object = this.createPolygon(4, pointer.x, pointer.y, Math.PI / 4);
                    break;
                case 'octagon':
                    this.object = this.createPolygon(8, pointer.x, pointer.y);
                    break;
            }
            this.maincanvas.add(this.object);
        },
        updateObject: function (pointer) {
            if (!this.isDown || !this.object) {
                return;
            }
            switch (this.shape) {
                case 'circle':
                    this.object.set({
                        radius: Math.abs(pointer.x - this.startPoint.x) / 2,
                    });
                    break;
                case 'square':
                    this.object.set({
                        width: Math.abs(pointer.x - this.startPoint.x),
                        height: Math.abs(pointer.y - this.startPoint.y),
                    });
                    break;
                case 'ellipse':
                        this.object.set({
                            rx: Math.abs(this.startPoint.x - pointer.x)/2,
                            ry: Math.abs(this.startPoint.y-pointer.y)/2,
                        });
                        break;
                case 'line':
                        this.object.set({ x2: pointer.x, y2: pointer.y });
                    break;
                case 'triangle':
                    this.object.set({
                        width: pointer.x - this.startPoint.x,
                        height: pointer.y - this.startPoint.y
                    });
                    break;
                case 'pentagon':
                case 'rhombus':
                case 'octagon':
                    this.updatePolygon(pointer);
                    break;
            }
            this.object.setCoords();
            this.maincanvas.renderAll();
        },
        finalizeObject: function () {
            // Additional logic if needed when finalizing the object
        },
        createPolygon: function (sides, left, top, angle = 0) {
            const radius = Math.min(100, Math.sqrt(Math.pow(left - this.startPoint.x, 2) + Math.pow(top - this.startPoint.y, 2)));
            const points = [];

            for (let i = 0; i < sides; i++) {
                const x = left + radius * Math.cos((2 * Math.PI * i) / sides + angle);
                const y = top + radius * Math.sin((2 * Math.PI * i) / sides + angle);
                points.push({ x, y });
            }

            return new fabric.Polygon(points, {
                left: left,
                top: top,
                fill: 'transparent',
                stroke: this.color,
                strokeWidth: this.width
            });
        },
        updatePolygon: function (pointer) {
            const sides = this.shape === 'pentagon' ? 5 : this.shape === 'rhombus' ? 4 : this.shape === 'octagon' ? 8 : 0;
            if (sides === 0 || !this.object) {
                return;
            }

            const centerX = (this.startPoint.x + pointer.x) / 2;
            const centerY = (this.startPoint.y + pointer.y) / 2;
            const radius = Math.min(100, Math.sqrt(Math.pow(this.startPoint.x - pointer.x, 2) + Math.pow(this.startPoint.y - pointer.y, 2)));

            const points = [];
            for (let i = 0; i < sides; i++) {
                const x = centerX + radius * Math.cos((2 * Math.PI * i) / sides);
                const y = centerY + radius * Math.sin((2 * Math.PI * i) / sides);
                points.push({ x, y });
            }
   console.log(points,sides)
            this.object.set({ points: points });
        }
    });
})(typeof exports !== 'undefined' ? exports : this);
