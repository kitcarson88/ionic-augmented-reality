var fs = require('fs');
//var path = require('path');

/*function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
      fs.mkdirSync( targetFolder );
  }

  //copy
  if ( fs.lstatSync( source ).isDirectory() ) {
      files = fs.readdirSync( source );
      files.forEach( function ( file ) {
          var curSource = path.join( source, file );
          if ( fs.lstatSync( curSource ).isDirectory() ) {
              copyFolderRecursiveSync( curSource, targetFolder );
          } else {
              copyFileSync( curSource, targetFolder );
          }
      } );
  }
}*/

module.exports = function(ctx) {
  //Copy roboto fonts
  //copyFolderRecursiveSync("./node_modules/roboto-fontface/css", "./src/assets/fonts/roboto");
    console.log("Copy redux persist fix file");
  fs.writeFileSync("./node_modules/redux-persist/src/index.d.ts", fs.readFileSync("./scripts/redux-persist-react-fix-file/index.d.ts"));
};
