// npm install gulp del

// load plugins
var fs = require('fs'),
    gulp = require('gulp'),
    del = require('del');

// Tasks

// Build Aya

gulp.task('build', function(cb) {
  var ayaPath = 'src/aya-login.user.js',
    themeBase = 'src/themes/';
    
  function loadFragmentFile(path) {
    try {
      fs.accessSync(path, fs.F_OK | fs.R_OK);
      return JSON.stringify(fs.readFileSync(path, {encoding:'utf8',flag:'r'}));
    } catch(err) {
      return false;
    }
  }
  
  function buildAya () {
    var aya = fs.readFileSync(ayaPath, {encoding:'utf8',flag:'r'}),
        version = aya.match(/@version\s*([\d.]+)/)[1];

    function ayaGen (err, themeList) {
      if (err) throw err;
      themeList.filter(function(themeName){
        var ayaya = aya,
            themeFragment = {
              HTML : loadFragmentFile(themeBase + themeName + '/body.html') || '',
              CSS :  loadFragmentFile(themeBase + themeName + '/style.css') || '',
              JS :   loadFragmentFile(themeBase + themeName + '/main.js') || ''
            };

        ayaya = ayaya.replace(/(var\s*theme\s*=\s*\{(?:.|\n)*HTML\s*:\s*)\".*\"/,'$1' + themeFragment.HTML)
                     .replace(/(var\s*theme\s*=\s*\{(?:.|\n)*CSS\s*:\s*)\".*\"/,'$1' + themeFragment.CSS)
                     .replace(/(var\s*theme\s*=\s*\{(?:.|\n)*JS\s*:\s*)\".*\"/,'$1' + themeFragment.JS);

        fs.writeFile('build/' + 'aya_login_' + themeName.replace(/\s/g,'_').toLowerCase() + '.v' + version + '.user.js',
                    ayaya,
                    function () {console.log( 'Aya Login v' + version + ' - ' + themeName + ' Generated');});
      });
    }

    fs.readdir(themeBase, ayaGen);
  }
  
  buildAya();
});

// Clean
gulp.task('clean', function(cb) {
  del(['build/*'], cb);
});


// Default task
gulp.task('default', ['clean'], function() {
  gulp.start( 'build');
});
