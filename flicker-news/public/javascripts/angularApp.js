var app = angular.module('flickerNews', [ 'angularRoutes']);



/**
 * Posts Factory.
 */
app.factory('posts', ['$http', 'auth', function($http, auth){
	var o = {
		posts: []
	};

	// GET request for retrieving a specific post
	o.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
	};

	// GET request for a  list of all posts currently stored in db
	o.getAll = function(){
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};

	//creating a new post
	o.create = function(post){

		return $http.post('/posts', post, {
			headers: {Authorization: 'Bearer '+ auth.getToken()}
		}).success(function(data){
				o.posts.push(data);
			});
	};



	// upvoting a post
	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.upvotes += 1;
		});
	};

	// adding a comment to a particular post
	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};


	// upvoting a  comment to a particular post
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data){
			comment.upvotes +=1;
		});
	};

	return o;

}]);

app.factory('auth', ['$http', '$window', '$rootScope', function($http, $window, $rootScope){
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


// Main Controller
app.controller('mainCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth){
	$scope.test = 'Hello world!';


	$scope.posts = posts.posts;

	//used for checking if user is logged in
	$scope.isLoggedIn = auth.isLoggedIn;


	$scope.addPost = function(){
		if( $scope.title === '') { return;}

		posts.create({
			title: $scope.title,
			link: $scope.link

		});
		$scope.title = '';
		$scope.link = '';


	};

	$scope.incrementUpvotes = function(post){
		posts.upvote(post);
	}
}]);

// Posts Controller mainly used to add comments to page
app.controller('postsCtrl', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth) {

	$scope.post = post;

	//used for checking if user is logged in
	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addComment = function () {

	if($scope.body === '') { return; }
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user'

		}).success(function(comment){
				$scope.post.comments.push(comment);
			});

		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment) {
		posts.upvoteComment(post, comment);
	}

}]);

/**
 * Registering and Login in Controller
 */
app.controller('authCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
		$scope.user = {};

		$scope.register = function(){
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};

		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};
	}]);

/**
 * Nav controller that indicates if user is logged in
 */

app.controller('navCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
	}]);