var fs = require('fs')
var q = require('q')
var findit = require('findit')
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')

// App configuration
var relevantFilename
var docsRootDir
var app

module.exports = function(options) {
  app = options.app
  app.use(bodyParser())
  docsRootDir = options.docsRootDir || '../'
  relevantFilename = options.relevantFileName || 'README.md'

  var docs = express.Router()
  docs.get('/', getDocs)
  docs.get('/:id', getDoc)
  docs.post('/:id', postDoc)
  app.use('/doc', docs)
}

function fileFormatter (file, data) {
  var dirSplit = file.split(path.sep)
  return {
    content: data,
    dirname: dirSplit[dirSplit.length-2],
    filepath: file,
    filerelpath: file.slice(docsRootDir.length + 1)
  }
}

function getDocs (req, res, next) {
  var finder = findit(docsRootDir)
  var files = []
  var deferreds = []

  finder.on('directory', function (dir, stat, stop) {
    var base = path.basename(dir);
    if (base === '.git' || base === 'node_modules' || base === 'jspm_packages') stop()
  })

  finder.on('file', function (file, stat) {
    var currFileName = path.basename(file)
    if(currFileName === relevantFilename) {
      var deferFileRead = q.defer()
      deferreds.push(deferFileRead.promise)

      fs.readFile(file, 'utf8', function(err, data) {
        if (err) { throw err }
        files.push(fileFormatter(file, data))
        deferFileRead.resolve()
      })
    }
  })

  finder.on('end', function() {
    q.all(deferreds).done(function() {
        res.json(files)
    })
  })
}

// TODO make this one work with ID
function getDoc (req, res, next) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) { throw err }
    res.json(fileFormatter(file, data))
  })
}

function postDoc (req, res, next) {
  var newDocContent = req.body.content

  fs.writeFile(req.body.filepath, newDocContent, function (err) {
    if (err) { throw err }
    res.json(req.body)
  })
}
