/// <reference path="../typings/angularjs/angular.d.ts"/>
var docsApp = angular.module('docsApp', [
  'ui.router',
  'ngResource',
  'toaster',
  'unsavedChanges'
])

docsApp.config(function($stateProvider, $urlRouterProvider, $logProvider) {

  $logProvider.debugEnabled(false)

  $urlRouterProvider.when('/', '/README.md')

  $stateProvider.state('root', {
    url: '/',
    controller: 'AppController',
    templateUrl: 'AppTemplate.html',
    resolve: {
      docs: function(DocService) {
        return DocService.doc.query().$promise
      }
    }
  })

  $stateProvider.state('root.doc', {
    url: ':id',
    controller: 'DocController',
    template: ''
  })

  // Make a trailing slash optional for all routes
  // ---------------------------------------------
  // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-make-a-trailing-slash-optional-for-all-routes
  $urlRouterProvider.rule(function($injector, $location) {
    var path = $location.path(),
        // Note: misnomer. This returns a query object, not a search string

        search = $location.search(),
        params

    // check to see if the path already ends in '/'
    if (path[path.length - 1] === '/') {
      return
    }

    // If there was no search string / query params, return with a `/`
    if (Object.keys(search).length === 0) {
      return path + '/'
    }

    // Otherwise build the search string and return a `/?` prefix
    params = []
    angular.forEach(search, function(v, k) {
      params.push(k + '=' + v)
    })
    return path + '/?' + params.join('&')
  })
})
