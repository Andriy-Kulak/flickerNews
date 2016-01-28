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

	//controllers
	'mainCtrl',
	'authCtrl',
	'postsCtrl',
	'navCtrl'


]);
