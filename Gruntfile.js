/*
 * grunt-modl-builder
 * https://github.com/pablo/grunt-modl-builder
 *
 * Copyright (c) 2014 Pablo Cabrera
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'tasks/*.js'],

            options: {
                jshintrc: true
            }
		},

		// Configuration to be run (and then tested).
		build_modl: {}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint']);

};