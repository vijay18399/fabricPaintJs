app.controller('WhiteboardController', function ($scope) {
    var canvas;
    $scope.activeTool = null;
    $scope.activePattern = null;
    $scope.activeColor = "red";
    $scope.stroke;
    $scope.colors = COLORS;
    $scope.tools = TOOLS;
    $scope.setActiveTool = function(tool) {
        $scope.activeTool = tool;
        $scope.activePattern = tool.defaultPattern; 
        $scope.subName = tool.subName
        console.log("Selected Tool:", tool.name);
        $scope.handleTool()
    };
    $scope.init = function () {
        canvas = new fabric.Canvas("fabricCanavs", {
            width: window.innerWidth,
            height: window.innerHeight,
            // backgroundColor: "rgb(240, 242, 245)",
        });
        var lowerCanvas = canvas.lowerCanvasEl;
        lowerCanvas.width = canvas.width;
        lowerCanvas.height = canvas.height;
        fabric.Image.fromURL('assets/bg.jpg', function (img) {
            img.set({
                left: 0,
                top: 0,
                selectable: false, // Make the background image non-selectable
                evented: false, // Make the background image non-evented
            });
        
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        });
    }

    $scope.init();
    $scope.handleTool = function () {
        canvas.isDrawingMode = true;
        switch ($scope.activeTool.name) {
            case "paint":
                $scope.handleBrush()
                break;
            case "shapes":
                canvas.freeDrawingBrush = new fabric.ShapeBrush(canvas);
                canvas.freeDrawingBrush.setShape($scope.activePattern)
                break;
            case "stamps":
                canvas.freeDrawingBrush = new fabric.ImageBrush(canvas, $scope.activePattern, );
                break;
            case "lines":
                canvas.freeDrawingBrush = new fabric.ShapeBrush(canvas);
                canvas.freeDrawingBrush.setShape("line")
                break;
            case "eraser":
                canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
                break;
            case "fill":
                canvas.freeDrawingBrush = new fabric.PaintBucket(canvas);
                break;
            default:
                // Default case
                console.log("No matching pattern found");
                canvas.isDrawingMode = false;
                break;
        }
        canvas.freeDrawingBrush.color = $scope.activeColor;
    };
   
    $scope.handleBrush= function(){
        canvas.freeDrawingBrush =  new fabric[$scope.activePattern + 'Brush'](canvas);
    }
    $scope.setActiveColor = function (color) {
        $scope.activeColor = color;
        canvas.freeDrawingBrush.color = color;
    }
    $scope.setActivePattern = function (pattern) {
        $scope.activePattern = pattern;
        console.log("Selected Pattern:", pattern);
        $scope.handleTool();
    };
    $scope.setActiveStroke= function (stroke) {
        $scope.stroke  = stroke;
        canvas.freeDrawingBrush.width = stroke;
    }
    $scope.undo = function () {
        canvas.undo()
    };
    $scope.redo = function () {
        canvas.redo()
    };
    $scope.download  = function () {
        var dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1.0
        });
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = `${(new Date()).toISOString()}.png`;
        a.click();
    };
    $scope.setActiveTool($scope.tools[0]); 
    $scope.setActiveColor($scope.colors[0]);
    $scope.setActiveStroke(5);
});