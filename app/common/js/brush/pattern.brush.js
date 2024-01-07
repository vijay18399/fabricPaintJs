fabric.CustomPatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    type: 'CustomPatternBrush',
    initialize: function (canvas) {
        this.canvas = canvas.upperCanvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.mainCanvas = canvas;
        this.patternImage = new Image();
        this.patternImage.src = 'assets/images/flower2.png';
        this.patternWidth = 30; // Assuming image size is 30x30
        this.patternHeight = 30;
        this.gap = 30; // Gap between pattern images
        this.lastDrawnPointer = null;
    },
    onMouseDown: function (pointer, options) {
        this.startPointer = pointer;
        this.drawPatternImage(pointer.x, pointer.y);
    },
    onMouseMove: function (pointer, options) {
        if (this.lastDrawnPointer) {
            var distance = this.calculateDistance(this.lastDrawnPointer, pointer);
            if (distance >= this.gap) {
                this.drawPatternImage(pointer.x, pointer.y);
                this.lastDrawnPointer = pointer;
            }
        } else {
            this.drawPatternImage(pointer.x, pointer.y);
            this.lastDrawnPointer = pointer;
        }
    },
    onMouseUp: function (pointer) {
        var imageDataUrl = this.mainCanvas.upperCanvasEl.toDataURL('image/png');

        fabric.Image.fromURL(imageDataUrl, (img) => {
            img.set({
                left: 0,
                top: 0,
                selectable: false
            });
            this.mainCanvas.add(img);
        });

        // Reset lastDrawnPointer on mouse up
        this.lastDrawnPointer = null;
    },
    drawPatternImage: function (x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.drawImage(this.patternImage, -15, -15, this.patternWidth, this.patternHeight);
        this.ctx.restore();
    },
    calculateDistance: function (point1, point2) {
        var deltaX = point2.x - point1.x;
        var deltaY = point2.y - point1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
});

