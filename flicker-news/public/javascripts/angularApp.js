/**
 * Core module
 */
angular.module('flickerNews', [

	//routes
	'angularRoutes',

	//factories
	'postsFactory',
	'authFactory',

	//controllers
	'mainCtrl',
	'authCtrl',
	'postsCtrl',
	'navCtrl'

]);
