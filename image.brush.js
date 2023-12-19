(function (global) {
    'use strict';
  
    if (fabric.ImageBrush) {
      fabric.warn('fabric.ImageBrush is already defined');
      return;
    }
  
    /**
     * ImageBrush class
     * @class fabric.ImageBrush
     * @extends fabric.Object
     * @see {@link fabric.ImageBrush#initialize} for constructor definition
     */
    fabric.ImageBrush = fabric.util.createClass(fabric.PencilBrush, {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: 'ImageBrush',
      initialize: function (canvas,image,sound) {
        this.canvas = canvas;
        this.ctx = canvas.contextContainer;
        this.imageUrl = image;
        this.soundUrl = sound;
        this.initSound()
      },
      initSound: function () {
        this.audio = new Audio(this.soundUrl);
      },
      playSound: function () {
        this.audio.currentTime = 0;
        this.audio.play();
      },
  
      onMouseDown: function (pointer) {
        // this.callSuper('onMouseDown', pointer, options);
        this.pointer = pointer;
        this.playSound()
        this.addImage();
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
      onImage : function(img) {
        img.set({
            left: this.pointer.x - (img.width / 2),
            top: this.pointer.y - (img.height / 2),
        });
        this.canvas.add(img);
        this.canvas.renderAll();
     },
      addImage : function(){
        fabric.Image.fromURL(this.imageUrl,this.onImage.bind(this) ,{crossOrigin: 'anonymous'});
      },
    });
  })(typeof exports !== 'undefined' ? exports : this);