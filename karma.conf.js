// Karma configuration

const isDocker = require("is-docker")();

import path from "path";

import webpackConf from "./webpack.config.js";

delete webpackConf[0].entry;
//inject instrumentation
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
		files: [
			{ pattern: "src/**/*karma.js", watched: false },
			{ pattern: "src/**/*spec.js", watched: false }
		],
		preprocessors: {
			"src/**/*.js": ["coverage"],
			"**/*karma.js": ["webpack", "sourcemap"],
			"**/*spec.js": ["webpack", "sourcemap"]
		},
		customLaunchers: {
			ChromeCI: {
				base: "Chrome",
				// docker needs no sandbox because perms
				flags: isDocker ? ["--no-sandbox"] : []
			}
		},
		webpack: webpackConf[0],
		reporters: ["spec", "coverage-istanbul", "coverage"],
		specReporter: {
			suppressSkipped: true,
			showSpecTiming: true
		},
		coverageIstanbulReporter: {
			reports: ["html", "text-summary"],
			dir: path.join(__dirname, "coverage"),
			// if using webpack and pre-loaders, work around webpack breaking the source path
			fixWebpackSourcePaths: true,
			// stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
			skipFilesWithNoCoverage: true,
			// Most reporters accept additional config options. You can pass these through the `report-config` option
			"report-config": {
				// all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
				html: {
					// outputs the report in ./coverage/html
					subdir: "html"
				}
			}
		},
		coverageReporter: {
			reporters: [{ type: "text" }]
		},
		webpackMiddleware: {
			// webpack-dev-middleware configuration
			stats: "errors-only"
		}
	});
};
