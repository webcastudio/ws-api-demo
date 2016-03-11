'use strict';

var request = require('request');

module.exports = function(grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729;
  var files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'public/css/*.css'
        ],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.ejs'],
        options: {
          livereload: reloadPort
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      all: [
        '{,*/}*.js'
      ]
    },
    jscs: {
      src: [
        '{,*/}*.js'
      ],
      options: {
        config: '.jscsrc',
        verbose: true,
        fix: true
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },
    express: {
      test: {
        options: {
          port: 9000,
          node_env: 'test',// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
          script: './bin/www'
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload',
    'Live reload after the node server has restarted.',
    function() {
      var done = this.async();
      var reloadUrl = 'http://localhost:' +
        reloadPort +
        '/changed?files=' + files.join(',');

      setTimeout(function() {
        request
          .get(reloadUrl,
          function(err, res) {
            var reloaded = !err && res.statusCode === 200;
            if (reloaded) {
              grunt.log.ok('Delayed live reload successful.');
            } else {
              grunt.log.error('Unable to make a delayed live reload.');
            }
            done(reloaded);
          });
      }, 500);
    });

  grunt.registerTask('coverage', ['jshint', 'jscs']);
  grunt.registerTask('test', [
    'coverage',
    'express:test',
    'mochaTest',
    'express:test:stop'
  ]);
  grunt.registerTask('serve', [
    'develop',
    'watch'
  ]);
};
