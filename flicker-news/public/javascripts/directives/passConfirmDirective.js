/**
 * Directive used to verify that Password and Confirm Password fields match.
 */
angular.module('passConfirmDirective', []).directive('validPasswordC', function () {
	return {
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function (viewValue, $scope) {
				var noMatch = viewValue != scope.regForm.password.$viewValue;
				ctrl.$setValidity('noMatch', !noMatch)
			})
		}
	}
})