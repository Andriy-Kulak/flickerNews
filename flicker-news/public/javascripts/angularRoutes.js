angular.module('angularRoutes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

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
		})

		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'authCtrl',
			// quick check if user already logged in, will redirect to home page
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		})

		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'authCtrl',
			// quick check if user already logged in, will redirect to home page
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()){
					$state.go('home');
				}
			}]
		});




	$urlRouterProvider.otherwise('home');
}]);