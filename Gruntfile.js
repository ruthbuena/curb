module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      options: {
        outputStyle: 'expanded',
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/sass/',
          src: '**/*.scss',
          dest: 'public/css/',
          ext: '.css'
        }]
      }
    },
    watch: {
      files: 'public/sass/**/*.scss',
      tasks: 'sass'
    },
    jshint: {
  all: ['app/**/*.js'],
  reporterOutput: ''
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-travis');
    grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['sass','watch']);

};
