/**
 * Main Controller
 */
angular.module('mainCtrl',[]).controller('mainCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth){
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