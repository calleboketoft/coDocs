angular.module('docsApp')
.controller('AppController', function($scope, DocService, $state, docs, $rootScope, toaster, $log) {
  $scope.docs = docs
  $scope.selectedDoc
  $scope.previewer
  $scope.forms = {}

  $scope.goToDoc = function(forcedFilePath) {
    var filePath = forcedFilePath || this.doc.filerelpath
    $state.go('root.doc', { id: encodeURIComponent(filePath) })
  }

  $scope.toggleEdit = function() {
    $log.debug('toggle edit')
    if($rootScope.editor.is('edit')) {
      $rootScope.editor.preview()
    } else {
      $rootScope.editor.edit()
    }
  }

  $scope.goFullscreen = function() {
    $log.debug('go fullscreen')
    $rootScope.editor.enterFullscreen()
  }

  $rootScope.editor = new EpicEditor({
    useNativeFullscreen: false,
    basePath: 'vendor/epiceditor/',
    theme: {
      base: '/themes/base/epiceditor.css',
      preview: '/themes/preview/github.css',
      editor: '/themes/editor/epic-light.css'
    },
    autogrow: true,
    button: false
  })

  $rootScope.editor.on('preview', function() {
    // Add necessary classes to <code> elements
    var previewerBody = $scope.previewer.body
    var codeBlocks = previewerBody.getElementsByTagName('code')

    for (var i = 0; i < codeBlocks.length; i++) {
      codeBlocks[i].className += ' prettyprint'
    }

    prettyPrint(null, previewerBody)
  })

  // Used when saving using keyboard
  $rootScope.editor.on('save', function() {
    $scope.saveDoc()
  })

  // When loading the app for the first time, an edit event is emitted
  var muteEdit = true;
  $rootScope.editor.on('edit', function() {
    if(muteEdit) {
      $log.debug('edit event: edit is muted, unmute');
      muteEdit = false
    } else if($rootScope.editor.is('loaded')) {
      $log.debug('edit event: set dirty')
      $scope.forms.saveDocForm.$setDirty()
    }
  })

  $rootScope.editor.on('unload', function() {
    $log.debug('unload event: set pristine, mute edit')
    muteEdit = true
    $scope.forms.saveDocForm.$setPristine()
  })

  $rootScope.editor.on('load', function() {
    $log.debug('load event: unmute edit')
    muteEdit = false
  })

  $scope.saveDoc = function() {
    var epicEditorText = JSON.parse(localStorage.getItem('epiceditor')).epiceditor.content
    $scope.selectedDoc.content = epicEditorText
    $scope.selectedDoc.$save().then(function(result) {
      $log.debug('saving, set pristine')
      $scope.forms.saveDocForm.$setPristine()
      $rootScope.$emit('notify-success', {
        header: 'Saved',
        body: $scope.selectedDoc.filepath
      })
    }, function(error) {
      $rootScope.$emit('notify-error', {
        header: 'Save failed',
        body: $scope.selectedDoc.filepath
      })
    })
  }

  // Global notifications
  $rootScope.$on('notify-error', function(event, message) {
    toaster.pop('error', message.header, message.body)
  })
  $rootScope.$on('notify-success', function(event, message) {
    toaster.pop('success', message.header, message.body)
  })

  // Filter by properties dirname and filepath
  $scope.searchProps = function (item) {
    var dirnameSearch = item.dirname && item.dirname.indexOf($scope.searchText)!=-1
    var filePathSearch = item.filepath && item.filepath.indexOf($scope.searchText)!=-1
    if (!$scope.searchText || dirnameSearch || filePathSearch)  {
      return true
    }
    return false
  }
})
