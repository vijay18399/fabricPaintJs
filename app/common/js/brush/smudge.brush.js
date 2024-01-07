fabric.SmudgeBrush = fabric.util.createClass(fabric.PencilBrush, {
    type: "SmudgeBrush",

    initialize(canvas, radius, hardness, alpha) {
        this.canvas = canvas;
        this.radius = radius;
        this.hardness = hardness;
        this.alpha = alpha;
        this.createTempCanvas();
        this.updateBrushDisplay(radius, alpha);
        this.lastX = 0;
        this.lastY = 0;
        this.lastForce = 1;
    },

    createTempCanvas() {
        this.brushCanvas = document.createElement("canvas");
        this.brushCanvas.width = this.radius * 2;
        this.brushCanvas.height = this.radius * 2;
        this.brushCanvasContext = this.brushCanvas.getContext("2d");
    },

    updateBrushDisplay(radius, alpha) {
        this.brushCanvasContext.clearRect(
            0,
            0,
            this.brushCanvas.width,
            this.brushCanvas.height
        );
        this.brushCanvasContext.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.brushCanvasContext.beginPath();
        this.brushCanvasContext.arc(
            this.brushCanvas.width / 2,
            this.brushCanvas.height / 2,
            radius,
            0,
            2 * Math.PI
        );
        this.brushCanvasContext.fill();
    },

    onMouseDown(pointer, options) {
        this.lastX = pointer.x;
        this.lastY = pointer.y;
        this.lastForce = options.pressure || 1;
        this.updateBrush(pointer.x, pointer.y);
    },

    onMouseMove(pointer, options) {
        if (!this.isDown) {
            return;
        }

        const force = options.pressure || 1;
        const line = this.setupLine(
            this.lastX,
            this.lastY,
            pointer.x,
            pointer.y
        );
        for (let more = true; more;) {
            more = this.advanceLine(line);
            const alpha = this.alpha * lerp(this.lastForce, force, line.u);
            this.drawBrush(line.position[0], line.position[1], alpha);
        }
        this.lastX = pointer.x;
        this.lastY = pointer.y;
        this.lastForce = force;
    },

    onMouseUp() {
        // Handle mouse up
    },

    setupLine(x, y, targetX, targetY) {
        // Setup line for drawing
        const deltaX = targetX - x;
        const deltaY = targetY - y;
        const deltaRow = Math.abs(deltaX);
        const deltaCol = Math.abs(deltaY);
        const counter = Math.max(deltaCol, deltaRow);
        const axis = counter == deltaCol ? 1 : 0;

        // setup a line draw.
        return {
            position: [x, y],
            delta: [deltaX, deltaY],
            deltaPerp: [deltaRow, deltaCol],
            inc: [Math.sign(deltaX), Math.sign(deltaY)],
            accum: Math.floor(counter / 2),
            counter: counter,
            endPnt: counter,
            axis: axis,
            u: 0,
        };
    },

    advanceLine(line) {
        // Advance line for drawing
        --line.counter;
        line.u = 1 - line.counter / line.endPnt;
        if (line.counter <= 0) {
            return false;
        }
        const axis = line.axis;
        const perp = 1 - axis;
        line.accum += line.deltaPerp[perp];
        if (line.accum >= line.endPnt) {
            line.accum -= line.endPnt;
            line.position[perp] += line.inc[perp];
        }
        line.position[axis] += line.inc[axis];
        return true;
    },

    drawBrush(x, y, alpha) {
        const ctx = this.canvas.contextTop;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(
            this.brushCanvas,
            x - this.radius,
            y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
        ctx.restore();
    },

    updateBrush(x, y) {
        // Update brush
        let width = this.brushCanvas.width;
        let height = this.brushCanvas.height;
        let srcX = x - width / 2;
        let srcY = y - height / 2;
        // draw it in the middle of the brush
        let dstX = (this.brushCanvas.width - width) / 2;
        let dstY = (this.brushCanvas.height - height) / 2;

        // clear the brush canvas
        this.brushCanvasContext.clearRect(
            0,
            0,
            this.brushCanvas.width,
            this.brushCanvas.height
        );

        // clip the rectangle to be inside
        if (srcX < 0) {
            width += srcX;
            dstX -= srcX;
            srcX = 0;
        }
        const overX = srcX + width - this.canvas.width;
        if (overX > 0) {
            width -= overX;
        }

        if (srcY < 0) {
            dstY -= srcY;
            height += srcY;
            srcY = 0;
        }
        const overY = srcY + height - this.canvas.height;
        if (overY > 0) {
            height -= overY;
        }

        if (width <= 0 || height <= 0) {
            return;
        }

        this.brushCanvasContext.drawImage(
            this.canvas.lowerCanvasEl,
            srcX,
            srcY,
            width,
            height,
            dstX,
            dstY,
            width,
            height
        );

        this.feather(this.brushCanvasContext);
    },

    feather(ctx) {
        // feather the brush
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        const { width, height } = ctx.canvas;
        ctx.translate(width / 2, height / 2);
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.restore();
    },
});
