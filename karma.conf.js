// Karma configuration

const isDocker = require("is-docker")();

import webpackConf from "./webpack.config.js";
delete webpackConf[0].entry;

module.exports = function(config) {
	config.set({
		basePath: "",
		frameworks: ["jasmine"],
		files: [{ pattern: "src/**/*karma.js", watched: false }],
		preprocessors: {
			"**/*karma.js": ["webpack"] //and sourcemap
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
		reporters: ["spec", "coverage"],
		specReporter: {
			suppressSkipped: true,
			showSpecTiming: true
		},
		coverageReporter: {
			reporters: [
				// {type: 'text'},
				{
					type: "lcov",
					dir: "coverage/functional/"
				},
				{
					type: "html",
					dir: "coverage/html/"
				}
			]
		},
		webpackMiddleware: {
			// webpack-dev-middleware configuration
			stats: "errors-only"
		}
	});
};
