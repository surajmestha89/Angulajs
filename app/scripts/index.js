var app = angular.module('myapp',['ui.router']);
 
app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {

    $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/Path/login/login.html'
        });
 
    $stateProvider.state('home', {
            url: '/home',
            template: '<strong>welcome</strong>'
        });
        
         $urlRouterProvider.otherwise('/');
}]);

//  app.controller('appdemo',function($scope){
//     $scope.text ='welcome working ';
//  });
// app.run(['$rootScope', ,'$scope',
//     function () {   
//     }]);