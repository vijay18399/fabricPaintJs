fabric.MagicFilterBrush = fabric.util.createClass(fabric.PencilBrush, {
    type: 'MagicFilterBrush',
    initialize: function (canvas) {
        this.canvas = canvas.upperCanvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.mainCanvas = canvas;
        this.filter = "invert";
    },
    onMouseDown: function (pointer, options) {
        this.startPointer = pointer;
        this.applyFilter(pointer.x, pointer.y);
    },
    onMouseMove: function (pointer, options) {
        this.applyFilter(pointer.x, pointer.y);
    },
    onMouseUp: function (pointer) {
        this.applyFilter(pointer.x, pointer.y);
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
    applyFilter: function (x, y) {
        switch (this.filter) {
            case "blur":
                this.applyFilterAndDraw("blur(5px)", x, y);
                break;
            case "grayscale":
                this.applyFilterAndDraw("grayscale(100%)", x, y);
                break;
            case "sepia":
                this.applyFilterAndDraw("sepia(100%)", x, y);
                break;
            case "invert":
                this.applyFilterAndDraw("invert(100%)", x, y);
                break;
            case "hueRotate":
                this.applyFilterAndDraw("hue-rotate(90deg)", x, y);
                break;
        }
    },
    applyFilterAndDraw: function (filter, x, y) {
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        var tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(this.canvas, 0, 0);

        tempCtx.filter = filter;
        this.setArc(tempCtx, x, y);

        this.ctx.drawImage(tempCanvas, 0, 0);

        tempCtx.filter = "none"; // Reset the filter for subsequent drawings
    },
    setArc: function (context, x, y) {
        context.beginPath();
        context.arc(x, y, 5, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
});
