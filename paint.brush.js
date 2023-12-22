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
     hexToRgb: function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      },
      initialize: function (canvas) {
        this.maincanvas = canvas;
        this.canvas = this.maincanvas.lowerCanvasEl;
        this.ctx = this.canvas.getContext('2d');
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
      addImage : function(img){
        img.set({
            left : 0,
            top : 0,
            width :this.imageData.width,
            height :this.imageData.height,
        })
        this.maincanvas.add(img);
        $('#_temp_canvas').remove();
        this.maincanvas.renderAll();
      },
      putImage: function (imageData) {
        this.imageData = imageData;
        var c = document.createElement('canvas');
        c.setAttribute('id', '_temp_canvas');
        c.width = imageData.width;
        c.height =  imageData.height;
        c.getContext('2d').putImageData(imageData, 0, 0,0,0,imageData.width,imageData.height);
        fabric.Image.fromURL(c.toDataURL(),this.addImage.bind(this));
        // this.download(c.toDataURL(),"a.png")
      },
      download: function(dataurl, filename) {
        const link = document.createElement("a");
        link.href = dataurl;
        link.download = filename;
        link.click();
      },
      paint: function (pointer) {
        var colorArray = this.hexToRgb(this.color);
        console.log(colorArray)
        draw_fill_without_pattern_support(20,this.canvas,this.ctx,pointer.x,pointer.y,colorArray.r, colorArray.g, colorArray.b, 255,this.putImage.bind(this))
      },
    });
  })(typeof exports !== 'undefined' ? exports : this);
  