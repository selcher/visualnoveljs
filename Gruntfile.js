module.exports = function( grunt ) {

	// Project Configuration
	grunt.initConfig( {
		pkg : grunt.file.readJSON( 'package.json' ),
		srcFiles : 'src/*.js',
		// buildSrcMinFile : 'build/<%= pkg.name %>-<%= pkg.version %>.min.js',
		buildSrcMinFile : 'build/<%= pkg.name %>.min.js',
		buildSrcFile : 'build/<%= pkg.name %>.js',
		cssSrcFile : 'src/*.css',
		buildCssSrcMinFile : 'build/<%= pkg.name %>.min.css',
		buildCssSrcFile : 'build/<%= pkg.name %>.css',
		testFiles : 'spec/*.js',
		domtestFiles : 'spec/dom/*.html',
		vendorFiles : 'dependencies/*.js',
		concat : {
			css : {
				options : {
					separator : ''
				},
				src : [ '<%= cssSrcFile %>' ],
				dest : '<%= buildCssSrcFile %>'
			},
			js : {
				options : {
					separator : ''
				},
				src : [ '<%= srcFiles %>' ],
				dest : '<%= buildSrcFile %>'
			}
		},
		uglify : {
			options : {
				banner : '/**\n' +
  						' * <%= pkg.name %> - v<%= pkg.version %> - build <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %>\n' +
  						' * Copyright (c) 2014-2015 Selcher;\n' +
  						' * Distributed under the terms of the MIT license.\n' +
						' */\n'
			},
			build : {
				src : '<%= buildSrcFile %>',
				dest : '<%= buildSrcMinFile %>'
			}
		},
		cssmin : {
			css : {
				src : '<%= buildCssSrcFile %>',
				dest : '<%= buildCssSrcMinFile %>'
			}
		},
		jshint : {
			all: [ 'Gruntfile.js', '<%= srcFiles %>' ]
		},
		watch : {
			files: [ '<%= srcFiles %>', 'Gruntfile.js' ],
			tasks: [ 'jasmine', 'qunit', 'jshint' ]
		},
		notify : {
			uglify : {
				options : {
					title : 'Minification complete',
					message : 'minification completed successfully'
				}
			}
		},
		jasmine : {
			test : {
				src : '<%= srcFiles %>',
				options : {
					specs : '<%= testFiles %>',
					vendor : [ '<%= vendorFiles %>' ],
				}
			}
		},
		qunit : {
			all : [ '<%= domtestFiles %>' ]
		}
	} );

	// Load the plugins
	// uglify -> minify
	// js hint -> code check
	// watch -> watch file changes
	// notify -> show notification
	// grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	// grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	// grunt.loadNpmTasks( 'grunt-contrib-watch' );
	// grunt.loadNpmTasks( 'grunt-notify' );
	// grunt.loadNpmTasks( 'grunt-contrib-jasmine' );

	// Replace multiple loadNpmTasks with matchdep and let it automatically add them
	require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

	// load Npm tasks... alertnative to matchdep
	// require( 'load-grunt-tasks' )( grunt, [ 'grunt-*', '!grunt-template-jasmine-requirejs' ] );

	// Defalt task : just minify code
	grunt.registerTask( 'default', [ 'jshint', 'concat', 'cssmin', 'uglify', 'notify' ] );

	// Development : watch for file changes and run:
	// 1. jasmine for code testing
	grunt.registerTask( 'dev', [ 'watch' ] );

	// Production : check code and then minify
	grunt.registerTask( 'prod', [ 'jshint', 'concat', 'cssmin', 'uglify', 'notify' ] );

};