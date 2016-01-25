/**
 * Posts Controller mainly used to add comments to page
 */
angular.module('postsCtrl', []).controller('postsCtrl', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth) {

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

	$scope.incrementDownvotes = function(comment) {
		posts.downvoteComment(post, comment);
	}

}]);