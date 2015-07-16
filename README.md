## Documentation App

#### Installation

Using with existing app

```javascript
var coDocs = require('./coDocs/serverRoutes')({
  app: app, // express app
  docsRootDir: path.resolve(__dirname, ''),
  relevantFileName: 'README.md'
})
```

#### App Features

- Here you can view and work with all README.md files under the ng-vergic directory.
- The left menu shows the names of the folders containing a README.md file
- NOTE: Exit fullscreen mode by pressing `Esc`
- All docs are written in the language Markdown, check out [Markdown Cheat Sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) For syntax

#### Creating a New Document

- Create a README.md file and put it in the folder where it should be
- Reload this app and the folder name with the README.md appears to the left

#### Saving Changes

- In addition to the "Save" button in the top menu, it is possible to save the current document by `Cmd + s` on Mac or `Ctrl + s` on Windows
- Saving will write directly to the README.md file in the file system

#### Removing a Document

- Erase it from the file system.

#### Documentation App Issues

- Reflow container when loading new doc
- scroll to top when loading a new doc
- unsaved changes triggers too many times when accepting losing changes
- after saving once, unsavedChanges warning wont trigger even if editing the document further
  * https://github.com/OscarGodson/EpicEditor/issues/131#issuecomment-6373306
  * https://github.com/programmieraffe/angular-editors/blob/master/editors/epiceditor/index.html
