// Karma configuration

const isDocker = require("is-docker")();

import webpackConf from "./webpack.config.js";
delete webpackConf[0].entry;
webpackConf[0].module.rules.push({
	test: /\.js$|\.jsx$/,
	use: {
		loader: "istanbul-instrumenter-loader",
		options: { esModules: true }
	},
	enforce: "post",
	exclude: /node_modules|\.spec\.js$/
});
module.exports = function(config) {
	config.set({
		basePath: "",
		frameworks: ["jasmine"],
		files: [{ pattern: "src/**/*karma.js", watched: false }],
		preprocessors: {
			"src/**/*.js": ["coverage"],
			"**/*karma.js": ["webpack", "sourcemap"]
		},

		customLaunchers: {
			ChromeCI: {
				base: "Chrome",
				// We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
				// more permissions than Docker allows by default)
				flags: isDocker ? ["--no-sandbox"] : []
			}
		},
		webpack: webpackConf[0],
		reporters: ["spec", "coverage-istanbul", "coverage"],
		specReporter: {
			suppressSkipped: true,
			showSpecTiming: true
		},
		coverageIstanbulReporter: {},
		coverageReporter: {
			reporters: [{ type: "text" }]
		},
		webpackMiddleware: {
			// webpack-dev-middleware configuration
			stats: "errors-only"
		}
	});
};
