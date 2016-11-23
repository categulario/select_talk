module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

	grunt.initConfig({
		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					"dist/js/app.js": "src/app.js"
				}
			}
		},

		postcss: {
			options: {
				map: true,

				processors: [
					require('autoprefixer')({browsers: 'last 2 versions'}),
					require('postcss-css-variables'),
				],
			},

			dist: {
				files: {
					"dist/css/app.css": "src/app.css"
				}
			}
		},

		concat: {
			vendorcss: {
				src: [
					'./bower_components/font-awesome/css/font-awesome.min.css',
				],
				dest: 'dist/css/vendor.css',
			},
			vendorjs: {
				src: [
					'./bower_components/babel-polyfill/browser-polyfill.js',
					'./bower_components/moment/min/moment-with-locales.min.js',
					'./bower_components/vue/dist/vue.min.js',
				],
				dest: 'dist/js/vendor.js',
			},
		},

		copy: {
			fontawesome: {
				files: [
					{
						expand: true,
						cwd: './bower_components/font-awesome/fonts/',
						src: ['*'],
						dest: 'dist/fonts/',
						filter: 'isFile',
						flatten: true,
					}
				]
			},
		},
	});

	grunt.registerTask("default", ["babel", "postcss", "concat", "copy"]);

};
