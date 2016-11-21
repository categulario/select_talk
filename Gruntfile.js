module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

	grunt.initConfig({
	  babel: {
		options: {
		  sourceMap: true
		},
		dist: {
		  files: {
			"dist/app.js": "app.js"
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
				  "dist/app.css": "app.css"
			  }
		  }
	  }
	});

	grunt.registerTask("default", ["babel", "postcss"]);

};
