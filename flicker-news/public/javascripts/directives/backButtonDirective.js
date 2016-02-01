angular.module('backButtonDirective', []).directive('backButton', ['$window', function($window) {
	return {
		restrict: 'C',
		link: function (scope, elem, attrs) {
			elem.bind('click', function () {
				$window.history.back();
			});
		}
	};
}]);