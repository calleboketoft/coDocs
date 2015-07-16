angular.module('docsApp')
.factory('DocService', function($resource) {
  return {
    doc: $resource('/doc/:id', { id: '@filepath' })
  }
})