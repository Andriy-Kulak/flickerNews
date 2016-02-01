/**
 * Core module
 */
angular.module('flickerNews', [

	//routes
	'angularRoutes',

	//factories
	'postsFactory',
	'authFactory',

	//directives
	'passConfirmDirective',
	'backButtonDirective',

	//controllers
	'mainCtrl',
	'authCtrl',
	'postsCtrl',
	'navCtrl'


]);
