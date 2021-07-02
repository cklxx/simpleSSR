const path = require("path");
const webpack = require("webpack");
const nodeTatget = "node";
const { ESBuildPlugin,ESBuildMinifyPlugin } = require('esbuild-loader');
const output_node = {
	output: {
		filename: "runtime.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "commonjs2",
	},
	optimization: {
		minimize: true,
		minimizer: [
			new ESBuildMinifyPlugin({
				target: "es2015", // Syntax to compile to (see options below for possible values)
			}),
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.TARGET": JSON.stringify(nodeTatget),
		}),
		new ESBuildPlugin(),
	],
};
const output_web = {
	output: {
		library: "runtime",
		libraryTarget: "amd",
		filename: "runtime.web.js",
		path: path.resolve(__dirname, "dist"),
	},
	optimization: {
		minimize: true,
		minimizer: [
			new ESBuildMinifyPlugin({
				target: "es2015", // Syntax to compile to (see options below for possible values)
			}),
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.TARGET": JSON.stringify(process.env.TARGET),
		}),
		new ESBuildPlugin(),
	],
};
const baseConfig = {
	entry: "./page/runtime/index.js",
	module: {
		rules: [
			// {
			// 	test: /\.m?jsx?$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	use: {
			// 		loader: "babel-loader",
			// 		options: {
			// 			presets: ["@babel/preset-react", "@babel/preset-env"],
			// 		},
			// 	},
			// },
			{
				test: /\.m?jsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "esbuild-loader",
					options: {
						// loader: "jsx", // Remove this if you're not using JSX
						target: "es2015", // Syntax to compile to (see options below for possible values)
					},
				},
			},
		],
	},
};

const serverConfig = Object.assign({}, baseConfig, output_node);
const clientConfig = Object.assign({}, baseConfig, output_web);
module.exports = [serverConfig, clientConfig];
