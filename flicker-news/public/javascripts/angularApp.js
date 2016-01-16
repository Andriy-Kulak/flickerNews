var app = angular.module('flickerNews', ['ui.router']);

//ui-route used for stateful programming
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$stateProvider
		//home page
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'mainCtrl',
			//ensure all the posts are loaded before page is loaded
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		})

		// posts page displaying comments
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'postsCtrl',
			//ensure all the comments for specific post are loaded before page is loaded
			resolve: {
				post: ['posts', '$stateParams', function(posts, $stateParams){
					return posts.get($stateParams.id);
				}]
			}
		});


	$urlRouterProvider.otherwise('home');
}]);

/**
 * Posts Factory.
 */
app.factory('posts', ['$http', function($http){
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
		return $http.post('/posts', post).success(function(data) {
			o.posts.push(data);
		});
	};



	// upvoting a post
	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote').success(function (data) {
			post.upvotes += 1;
		});
	};

	// adding a comment to a particular post
	o.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};


	// upvoting a  comment to a particular post
	o.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function(data){
			comment.upvotes +=1;
		});
	};

	return o;

}]);


// Main Controller
app.controller('mainCtrl', ['$scope', 'posts', function($scope, posts){
	$scope.test = 'Hello world!';


	$scope.posts = posts.posts;


	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return;}

		posts.create({
			title: $scope.title,
			link: $scope.link,

		});
		$scope.title = '';
		$scope.link = '';


	};

	$scope.incrementUpvotes = function(post){
		posts.upvote(post);
	}
}]);

// Posts Controller mainly used to add comments to page
app.controller('postsCtrl', ['$scope', '$stateParams', 'posts', 'post', function($scope, $stateParams, posts, post) {

	$scope.post = post;

	$scope.addComment = function () {

	if($scope.body === '') { return; }
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user',

		}).success(function(comment){
				$scope.post.comments.push(comment);
			});

		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment) {
		posts.upvoteComment(post, comment);
	}

}]);