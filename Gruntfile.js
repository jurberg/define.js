module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
    },
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/**/*.spec.js',
        vendor: [
          'lib/jquery-1.9.1.js' 
        ]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.repository.url %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/define.js',
        dest: 'dist/define.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);

};
