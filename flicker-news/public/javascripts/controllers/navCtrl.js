/**
 * Nav controller that indicates if user is logged in
 */

angular.module('navCtrl', []).controller('navCtrl', ['$scope', 'auth', function($scope, auth){

	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
}]);