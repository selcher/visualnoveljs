module.exports = function( grunt ) {

	// Project Configuration
	grunt.initConfig( {
		pkg : grunt.file.readJSON( 'package.json' ),
		srcFiles : 'src/*.js',
		buildFile : 'build/<%= pkg.name %>-<%= pkg.version %>.min.js',
		testFiles : 'spec/*.js',
		domtestFiles : 'spec/dom/*.html',
		vendorFiles : 'dependencies/*.js',
		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
			},
			build : {
				src : '<%= srcFiles %>',
				dest : '<%= buildFile %>'
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
	grunt.registerTask( 'default', [ 'jasmine', 'qunit', 'uglify', 'notify' ] );

	// Development : watch for file changes and run:
	// 1. jasmine for code testing
	grunt.registerTask( 'dev', [ 'watch' ] );

	// Production : check code and then minify
	grunt.registerTask( 'prod', [ 'jshint', 'jasmine', 'uglify', 'notify' ] );

};