// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('icm', ['ionic','ngSanitize','ngRoute'])

//Configuring the app navegation
.config(function($routeProvider){
  $routeProvider

  //router for home page
  .when('/', {
    templateUrl: '../views/home.html',
    controller: 'icmCtrl'
  })

  .when('/avisos', {
    templateUrl:'../views/avisos.html',
    controller: 'icmCtrl'
  })

  .when('/inscricoes', {
    templateUrl:'../views/inscricoes.html',
    controller: 'icmCtrl'
  })

   .when('/igrejas', {
    templateUrl:'../views/igrejas.html',
    controller: 'icmCtrl'
  })

   .when('/membros', {
    templateUrl:'../views/membros.html',
    controller: 'icmCtrl'
  })

   .when('/ao_vivo', {
    templateUrl:'../views/ao_vivo.html',
    controller: 'icmCtrl'
  })

   .when('/radio', {
    templateUrl:'../views/radio.html',
    controller: 'icmCtrl'
  })
})


.factory('blogFactory', function($q,$http){
  var _url = 'https://dev.3-code.com/icmazenha/wp-json/wp/v2';
  var deferred = $q.defer();

  function getAllPosts(){
    var url = _url + '/posts?callback=JSON_CALLBACK';
    $http.get(url).success(deferred.resolve).error(deferred.reject);
    return deferred.promise;
  }

  function getAvisos(pagina){
    var url = null;
    var avisos = {};
    if(pagina == null || pagina === undefined || isNaN(pagina)){
      url = _url + '/posts?' + 'categorie=9&'+ 'per_page=5&' + 'callback=JSON_CALLBACK';
    }else{
      url = _url + '/posts?' + 'categorie=9&'+ 'per_page=5&' + 'page='+ pagina + '&callback=JSON_CALLBACK';
    }
    
    $http.get(url).success(function(data, status, headers, config){
      avisos.data = data;
      avisos.totalpages = headers('x-wp-totalpages');
      avisos.totalItens = headers('x-wp-total')
      deferred.resolve(avisos);
    }).error(deferred.reject);

    return deferred.promise;
  }

  return{
    getAllPosts: getAllPosts,
    getAvisos: getAvisos
  };

})

.controller('icmCtrl', function($scope,  $ionicModal, $location, blogFactory){
  
  $scope.avisos = [];
  $scope.avisosCurrentPage = 1;

  $scope.rediretTo = function(path){
    $location.path(path);
  }

  //FIXME: Not working
  $scope.refresh = function(item){
    if(item == 'avisos'){
      $scope.avisos = null;
      $scope.avisosCurrentPage = 1;
      $scope.getAvisos();
    }

  }

  //FIXME: Not working
  $scope.loadMore = function(item){
    if(item == 'avisos'){
      $scope.avisosCurrentPage += 1;
      if($scope.avisosCurrentPage <= $scope.avisos.totalpages){
        getAvisos($scope.avisosCurrentPage);
      }else{
        getAvisos($scope.avisos.totalpages);  
      }
    }
  }

  $scope.getAvisos = function(){
    blogFactory.getAvisos().then(function(data){
      $scope.avisos = data;
      console.log(">>>>>",data)
    }, function(error){
      console.log(">>>>>",error)
    });
  }

})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
});
