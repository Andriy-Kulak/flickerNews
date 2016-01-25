/**
 * Posts Factory.
 */
angular.module('postsFactory', []).factory('posts', ['$http', 'auth', function($http, auth){
	var obj = {
		posts: []
	};

	// GET request for retrieving a specific post
	obj.get = function(id) {
		return $http.get('/posts/' + id).then(function(res){
			return res.data;
		});
	};

	// GET request for a  list of all posts currently stored in db
	obj.getAll = function(){
		return $http.get('/posts').success(function(data) {
			angular.copy(data, obj.posts);
		});
	};

	//creating a new post
	obj.create = function(post){

		return $http.post('/posts', post, {
			headers: {Authorization: 'Bearer '+ auth.getToken()}
		}).success(function(data){
			obj.posts.push(data);
		});
	};

	// upvoting a post
	obj.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.upvotes += 1;
		});
	};

	// downvoting a post
	obj.downvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.upvotes -= 1;
		});
	};

	// adding a comment to a particular post
	obj.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};


	// upvoting a  comment to a particular post
	obj.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data){
			comment.upvotes +=1;
		});
	};

	//downvoting a comment
	obj.downvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function(data){
			comment.upvotes -=1;
		});
	};

	return obj;

}]);
