(function (global) {
    'use strict';

    if (fabric.CustomPatternBrush) {
        fabric.warn('fabric.PatternBrush is already defined');
        return;
    }

    fabric.CustomPatternBrush = fabric.util.createClass(fabric.BaseBrush, {
        type: 'patternBrush',
        initialize: function (canvas, options) {
            options = options || {};
            this.maincanvas = canvas;
            this.canvas = this.maincanvas.lowerCanvasEl;
            this.ctx = this.canvas.getContext('2d');
            this.patternWidth = options.patternWidth || 10;
            this.patternHeight = options.patternHeight || 10;
            // this.createPattern();
        },
        createPattern: function (pointer) {
            if(false){
                this.pattern = new fabric.Rect({
                    width: this.patternWidth,
                    height: this.patternHeight,
                    fill: 'transparent',
                    stroke: this.color,
                    fill:"black",
                    strokeWidth: this.width
                });
            }else{
              
                 
                var arr = []
                for(var i = 0; i<=10;i++){
                  let x =  new fabric.Rect({
                        width: 10,
                        height: 20,
                        fill: 'pink',
                        originX: 'center',
                        originY: 'bottom',
                        angle: i * 36
                    });
                    arr.push(x)
                } 
                const center = new fabric.Circle({
                    radius: 5,
                    fill: 'yellow',
                    originX: 'center',
                    originY: 'center',
                });
    
                this.pattern = new fabric.Group([...arr,center], {
                    left: pointer.x,
                    top: pointer.y,
                    selectable: false
                });
                this.maincanvas.add( this.pattern )
            }
           
        },
        onMouseDown: function (pointer) {
            this.currentPointer = this.startPointer = pointer;
             this.createPattern(pointer);
        },
        onMouseMove: function (pointer, options) {
            if (!this.currentPointer) {
                return;
            }
            this.currentPointer = pointer;
             this.createPattern();
        },
        onMouseUp: function (event) {
            this.currentPointer = null;
        },
        drawSquare: function () {
            if (!this.currentPointer || !this.startPointer) {
                return;
            }
            
            const deltaX = this.currentPointer.x - this.startPointer.x;
            const deltaY = this.currentPointer.y - this.startPointer.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const angle = Math.atan2(deltaY, deltaX);

            const steps = Math.ceil(distance / this.patternWidth);

            for (let i = 0; i < steps; i++) {
                const x = this.startPointer.x + Math.cos(angle) * (i * this.patternWidth);
                const y = this.startPointer.y + Math.sin(angle) * (i * this.patternHeight);

                this.pattern.set({ left: x, top: y });
                this.pattern.render(this.ctx);
            }

            this.startPointer = this.currentPointer;
        },
        setPatternWidth: function (width) {
            this.patternWidth = width;
            this.createPattern();
        },
        setPatternHeight: function (height) {
            this.patternHeight = height;
            this.createPattern();
        }
    });
})(typeof exports !== 'undefined' ? exports : this);
