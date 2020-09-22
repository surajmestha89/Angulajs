module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-sourcemap');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src'
        },
        src: ['app/src/**/*.tpl.html'],
        dest: 'build/templates-app.js'
      }
    },
    less: {
      all: {
        src: 'style.less',
        dest: 'app/build/style.css',
        options: {
          report: 'gzip'
        }
      }
    },
    connect: {
      serve: {
        options: {
          port: 8080,
          base: 'app/build/',
          hostname: '*',
          debug: true
        }
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      templates: {
        files: ['app/src/**/*.tpl.html'],
        tasks: ['html2js']
      },
      less: {
        files: ['style.less', 'app/src/**/*.less'],
        tasks: ['less']
      },
      sources: {
        files: ['src/**/*.js', 'app/src/*.js'],
        tasks: ['concat_sourcemap:app']
      },
      index: {
        files: 'index.html',
        tasks: ['copy:index']
      }
      // Useful for watching / rerunning karma tests
      // jsTest: {
      //    files: ['app/test/spec/{,*/}*.js'],
      //    tasks: ['karma']
      //}
    },
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      app: {
        src: ['app/src/**/*.js', 'src/*.js'],
        dest: 'app/build/app.js'
      },
      libs: {
        src: [
          'libs/angular/angular.js',
          'libs/angular-animate/angular-animate.js',
          'libs/angular-mocks/angular-mocks.js',
          'libs/angular-ui-router/release/angular-ui-router.js'
        ],
        dest: 'build/libs.js'
      }
    },
    copy: {
      index: {
        src: 'index.html',
        dest: 'build/',
        options: {
          processContent: function (content, srcpath) {
            // Compiling index.html file!
            var packageVersion = require('./package.json').version;
            return grunt.template.process(content, {
              data: {
                version: packageVersion
              }
            });
          }
        }
      }
    },
    clean: {
      all: {
        src: ['app/build/']
      }
    },
    // Test settings
    karma: {
      unit: {
        configFile: 'app/test/karma.conf.js',
        singleRun: true
      }
    }
  });

  // Build process:
  // - clean build/
  // - creates build/templates-app.js from *.tpl.html files
  // - creates build/style.css from all the .less files
  // - concatenates all the source files in build/app.js - banner with git revision
  // - concatenates all the libraries in build/libs.js
  // - copies index.html over build/
  grunt.registerTask('build', ['clean', 'html2js', 'less', 'concat_sourcemap:app', 'concat_sourcemap:libs', 'copy']);
  grunt.registerTask('default', ['clean', 'concat_sourcemap:libs', 'connect', 'watch']);
  grunt.registerTask('test', ['karma']);
};
