/**
 * Auth Factory
 */
angular.module('authFactory',[]).factory('auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
	var auth = {
		//saving Token
		saveToken: function (token) {
			$window.localStorage['flicker-news-token2'] = token;
		},

		//getting Token
		getToken: function () {
			return $window.localStorage['flicker-news-token2'];
		},

		//returns a boolean value if user is logged in
		isLoggedIn: function () {
			var token = auth.getToken();
			if (token) {
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload.exp > Date.now() / 1000;
			} else {
				return false;
			}
		},

		//returns the username of the user that is logged in
		currentUser: function () {
			if (auth.isLoggedIn()) {
				var token = auth.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload.username;
			}
		},

		//Register function that posts user to our register route and saves the token returned
		register: function (user) {
			return $http.post('/register', user).success(function (data) {
				auth.saveToken(data.token);
			});
		},

		//Login function that posts a user to our login page and saves the token returned
		logIn: function (user) {
			return $http.post('/login', user).success(function (data) {
				auth.saveToken(data.token);
			});
		},

		//Logout
		logOut: function () {
			$window.localStorage.removeItem('flicker-news-token2');
		}
	};

	return auth;
}]);