const path = require("path");
module.exports = {
	entry: "./src/main",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js/,
				loader: "babel-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: ["node_modules", path.resolve(__dirname, "src")]
	},
	devtool: "inline-source-map",
	target: "web",
	devServer: {
		proxy: {
			// proxy URLs to backend development server
			"/api": "http://localhost:8000"
		},
		contentBase: path.join(__dirname, "demo") // boolean | string | array, static file location
		// compress: true, // enable gzip compression
		// historyApiFallback: true, // true for index.html upon 404, object for multiple paths
		// hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
		// https: false, // true for self-signed, object for cert authority
		// noInfo: true, // only errors & warns on hot reload
		// ...
	}
};
