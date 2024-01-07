fabric.SequencePatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    type: 'SequencePatternBrush',
    initialize: function (canvas) {
        this.canvas = canvas.upperCanvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.mainCanvas = canvas;
        this.gap = 30; // Gap between pattern images
        this.lastDrawnPointer = null;
        this.index = 0;
        this.patternImage =[]
        this.loadSequence()
    },
    loadSequence:function(){
        for(var i=0;i<8;i++){
            this.patternImage[i] = new Image();
            this.patternImage[i].src = 'assets/images/dog/'+(i+1)+'.png';
            this.patternWidth = 30; // Assuming image size is 30x30
            this.patternHeight = 30;
        }
      
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
        this.index  =0;
    },
    drawPatternImage: function (x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.drawImage(this.patternImage[(this.index)%7], -15, -15, this.patternWidth, this.patternHeight);
        this.ctx.restore();
        this.index++;
    },
    calculateDistance: function (point1, point2) {
        var deltaX = point2.x - point1.x;
        var deltaY = point2.y - point1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
});


