// app/directives/stroke.directive.js
app.directive('stroke', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/stroke/stroke.html',
        scope: {
            stroke: '=',
            on_stroke_change : '&onStrokeChange'
        },
        'link' : function(scope, element, attrs) {
            scope.updateStroke = function() {
                scope.on_stroke_change({'stroke' : scope.stroke});
            } 
        }
    };
});