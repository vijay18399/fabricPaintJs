// app/directives/colors.directive.js
app.directive('colors', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/colors/colors.html',
        scope: {
            activeColor: '=',
            colors: '=',
            on_color_change : '&onColorChange'
        },
        'link' : function(scope, element, attrs) {
            scope.setActiveColor = function(color) {
                scope.on_color_change({'color' : color});
            } 
        }
    };
});
