/**
 * Created by Frank on 15/7/27.
 */

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    var watchFiles = {
        serverJS: ['Gruntfile.js', 'src/server.js',
            'src/config/**/*.js', 'src/app/**/*.js']
    };

    grunt.initConfig({

        watch: {
            scripts: {
                files: watchFiles.serverJS,
                tasks: ['jshint'],
                livereload: true
            }
        },

        jshint: {
            all: {
                src: watchFiles.serverJS,
                options: {
                    jshintrc: true
                }
            }
        },
        clean: {
            build: {
                src: ['build/*']
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**'],
                    dest: 'build/Release'
                }, {
                    expand: true,
                    src: 'package.json',
                    dest: 'build/Release'
                }]
            }

        }
    });

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('build', ['clean', 'copy']);


};
