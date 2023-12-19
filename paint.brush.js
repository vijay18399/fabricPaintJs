(function (global) {
    'use strict';
  
    if (fabric.PaintBucket) {
      fabric.warn('fabric.PaintBucket is already defined');
      return;
    }
  
    /**
     * PaintBucket class
     * @class fabric.PaintBucket
     * @extends fabric.Object
     * @see {@link fabric.PaintBucket#initialize} for constructor definition
     */
    fabric.PaintBucket = fabric.util.createClass(fabric.PencilBrush, {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: 'paintBucket',
  
      initialize: function (canvas) {
        this.canvas = canvas;
        this.ctx = canvas.contextContainer;
        this.floodFill = new FloodFill();
        this.fill = this.fill.bind(this);
      },
  
      fill: function (color, x, y, tolerance) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.floodFill.init(imageData);
        this.floodFill.fill(color, x, y, tolerance,  this.putImage.bind(this));
      
      },
      putImage: function (imageData) {
        console.log("Flood-fill algorithm completed.");
        if (imageData) {
          var _this = this; // Save reference to 'this'
      
          // Create a new Fabric.js Image object from the imageData
          var img = new fabric.Image.fromURL('data:image/png;base64,' + btoa(String.fromCharCode.apply(null, imageData.data)), function (img) {
            // Set the position and other properties as needed
            img.set({
              left: 0,
              top: 0,
              width: _this.canvas.width,
              height: _this.canvas.height,
              selectable: false, // Make it non-selectable if needed
            });
      
            // Add the Image object to the canvas
            _this.canvas.add(img);
      
            // Request render to reflect the changes on the canvas
            _this.canvas.requestRenderAll();
          });
        }
      },
      
      
      onMouseDown: function (pointer) {
        const options = {
          e: pointer,
        };
        // this.callSuper('onMouseDown', pointer, options);
        this.paint(pointer);
      },
  
      onMouseMove: function (pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return;
        }
  
        // this.callSuper('onMouseMove', pointer, options);
      },
  
      onMouseUp: function (event) {
        // this.callSuper('onMouseUp', event);
      },
  
      paint: function (pointer) {
        const fillTolerance = 0;
        const fillColor = this.canvas.freeDrawingBrush.color;
        const strokeColor = this.canvas.freeDrawingBrush.strokeColor;
  
        const mouseX = Math.round(pointer.x);
        const mouseY = Math.round(pointer.y);
  
        this.fill(fillColor, mouseX, mouseY, fillTolerance);
      },
    });
  })(typeof exports !== 'undefined' ? exports : this);
  