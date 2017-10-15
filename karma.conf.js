// Karma configuration
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
