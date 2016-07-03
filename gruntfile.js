module.exports = function (grunt) {

  // config tasks
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    concat: {
      build: {
        src: ["src/**/*.js"],
        dest: "dest/<%=pkg.name %>.js",
      }
    },
    uglify: {
      build: {
        src: "dest/<%=pkg.name %>.js",
        dest: "dest/<%=pkg.name %>.min.js"
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', '*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // register tasks    
  grunt.registerTask('default', ['help']);

  grunt.registerTask('help', function () {
    console.log('');
    console.log('Availible Commands:');
    console.log('  grunt lint');
    console.log('  grunt concat');
    console.log('  grunt uglify');
  });

  grunt.registerTask('lint', ['jshint']);
};
