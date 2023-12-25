app.directive('toolbar', function () {
    return {
        templateUrl: 'app/directives/toolbar/toolbar.html',
        scope: {
            activeTool: '=',
            tools: '=',
            tool_change : '&onToolChange',
            undo: '&',
            redo: '&',
            download: '&',
        },
        link : function(scope, element, attrs) {
            scope.setTool = function(tool) {
                scope.tool_change({'tool' : tool});
            } 
      }
    }
});
