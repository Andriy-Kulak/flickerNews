var app = angular.module('flickerNews', ['ui.router']);

//ui-route used for stateful programming
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'mainCtrl'
		})

		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'postsCtrl'
		});


	$urlRouterProvider.otherwise('home');
}]);

app.factory('postsFactory', [function(){
	var o = {
		posts: [

		]
	};

	return o;
}]);


// Main Controller
app.controller('mainCtrl', ['$scope', 'postsFactory', function($scope, postsFactory){
	$scope.test = 'Hello world!';


	$scope.posts = postsFactory.posts;


	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return;}

		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0,
			comments: [
				{author: 'Joe', body: 'Cool post!', upvotes: 0},
				{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
			]
		});
		$scope.title = '';
		$scope.link = '';



	};

	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	}
}]);

// Posts Contoller
app.controller('postsCtrl', ['$scope', '$stateParams', 'postsFactory', function($scope, $stateParams, postsFactory){

	$scope.post = postsFactory.posts[$stateParams.id];
}]);