// app/directives/patterns.directive.js
app.directive('patterns', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/patterns/patterns.html',
        scope: {
            activePattern: '=',
            activeTool: '=',
            subName: '=',
            on_pattern_change : '&onPatternChange'
        },
        'link' : function(scope, element, attrs) {
            scope.setPattern = function(pattern) {
                scope.on_pattern_change({'pattern' : pattern});
            } 
        }
    };
});
