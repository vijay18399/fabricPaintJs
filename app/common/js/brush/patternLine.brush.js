fabric.PatternLineBrush = fabric.util.createClass(fabric.BaseBrush, {
    type: 'PatternLineBrush',
    initialize: function (canvas) {
        this.canvas = canvas.upperCanvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.mainCanvas = canvas
        this.patternImage = new Image();
        this.patternImage.src = 'assets/images/flower2.png';
        this.gap = 30; // Gap between images (30 for image size + 4 for space)
    },
    onMouseDown: function (pointer) {
        this.startPointer = pointer;
        this.isDrawing = true;

        // Draw an initial image at the starting point
        this.drawPatternImage(pointer.x, pointer.y, 0);
    },
    onMouseMove: function (pointer, options) {
        if (this.isDrawing) {
            this.drawLine(pointer);
        }
    },
    onMouseUp: function () {
        this.isDrawing = false;
        // Convert canvas drawing to image and add it as Fabric Image
        var imageDataUrl = this.mainCanvas.upperCanvasEl.toDataURL('image/png');
        
        fabric.Image.fromURL(imageDataUrl, (img) => {
            img.set({
                left: 0,
                top: 0,
                selectable: false
            });
            this.mainCanvas.add(img);
        });
    },
    clearUpperCanvas: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawLine: function (pointer) {
        this.clearUpperCanvas();
        var distance = this.calculateDistance(this.startPointer, pointer);
        console.log(distance)
        var numImages = Math.round(distance / this.gap);
        if(numImages<0){
            numImages=1;
        }
        if (numImages > 0) {
            var angle = this.calculateAngle(this.startPointer, pointer);
            var deltaX = (pointer.x - this.startPointer.x) / numImages;
            var deltaY = (pointer.y - this.startPointer.y) / numImages;

            for (var i = 1; i <= numImages; i++) {
                var x = this.startPointer.x + i * deltaX;
                var y = this.startPointer.y + i * deltaY;
                this.drawPatternImage(x, y, angle);
            }
        }
    },
    drawPatternImage: function (x, y, angle) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.drawImage(this.patternImage, -15, -15, 30, 30); // Assuming image size is 30x30
        this.ctx.restore();
    },
    calculateDistance: function (point1, point2) {
        var deltaX = point2.x - point1.x;
        var deltaY = point2.y - point1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    calculateAngle: function (startPoint, endPoint) {
        var deltaX = endPoint.x - startPoint.x;
        var deltaY = endPoint.y - startPoint.y;
        return Math.atan2(deltaY, deltaX);
    }
});

