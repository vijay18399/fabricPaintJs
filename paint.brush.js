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
        this.canvas = canvas;
        this.ctx = canvas.contextContainer;
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
      addImage : function(c,img){
        img.left = 0;
        img.top = 0;
        this.canvas.add(img);
        img.bringToFront();
        c = null;
        $('#_temp_canvas').remove();
   
        this.canvas.renderAll();
      },
      putImage: function (imageData) {
        var c = document.createElement('canvas');
        c.setAttribute('id', '_temp_canvas');
        c.width = this.canvas.width;
        c.height =  this.canvas.height;
        c.getContext('2d').putImageData(imageData, 0, 0);
        fabric.Image.fromURL(c.toDataURL(),this.addImage.bind(this,c));
      },
    
      paint: function (pointer) {
        var colorArray = this.hexToRgb(this.color);
        console.log(colorArray)
        draw_fill_without_pattern_support(1,this.canvas,this.ctx,pointer.x,pointer.y,colorArray.r, colorArray.g, colorArray.b, 255,this.putImage.bind(this))
      },
    });
  })(typeof exports !== 'undefined' ? exports : this);
  