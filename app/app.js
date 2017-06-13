/*
 * 模块引导
 * @author 王杰
 */

var taojin_room = angular.module('taojin_room', ['ngRoute', 'FBAngular', 'lumx']);

taojin_room.config(function($routeProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'app/login/login.html',
			controller: 'loginController'
		})
		.when('/login', {
			templateUrl: 'app/login/login.html',
			controller: 'loginController'
		})
		.when('/call', {
			templateUrl: 'app/call/call.html',
			controller: 'callController'
		});
	//            .otherwise({
	//                templateUrl: 'error.html',
	//                controller: 'MainController',
	//            });
});

var appConfig = {
	"httpUri":"http://192.168.1.103:8443/",
	"wssUri":"ws://192.168.1.103:8443/"
}
