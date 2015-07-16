angular.module('docsApp')
.controller('DocController', function($scope, $stateParams, $rootScope, $timeout, $window) {
  angular.forEach($scope.$parent.docs, function(doc) {
    if(doc.filerelpath === decodeURIComponent($stateParams.id)) {
      $scope.$parent.selectedDoc = doc
    }
  })

  if ($rootScope.editor.is('loaded')) {
    $rootScope.editor.unload()
  }
  var newDoc = JSON.stringify({
    epiceditor: {
      content: $scope.$parent.selectedDoc.content
    }
  })

  localStorage.setItem('epiceditor', newDoc)

  // Prettifying the preview
  // https://github.com/OscarGodson/EpicEditor/issues/147
  $rootScope.editor.load(function() {
    $scope.$parent.previewer = this.getElement('previewer')

    // Prettify CSS
    var getCssTag = function(previewer, tagHref) {
      var cssTag = previewer.createElement('link')
      cssTag.rel = 'stylesheet'
      cssTag.type = 'text/css'
      cssTag.href = tagHref
      return cssTag
    }

    $scope.$parent.previewer.head.appendChild(getCssTag($scope.$parent.previewer, 'vendor/google-code-prettify/prettify.css'))

    // Github CSS
    // http://jmblog.github.io/color-themes-for-google-code-prettify/github/
    $scope.$parent.previewer.head.appendChild(getCssTag($scope.$parent.previewer, 'vendor/google-code-prettify/github.css'))

    // Our own styles for the previewer
    $scope.$parent.previewer.head.appendChild(getCssTag($scope.$parent.previewer, 'styles.css'))
  })

  var test = $rootScope.editor.preview()
  $timeout(function() {
    $window.scrollTo(0,0)
  }, 100)
})
