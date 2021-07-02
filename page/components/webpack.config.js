const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptPlugin = require("optimize-css-assets-webpack-plugin");
const { ESBuildPlugin,ESBuildMinifyPlugin } = require("esbuild-loader");
const output_node = {
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "commonjs2",
	},
};
const output_web = {
	output: {
		library: "comp",
		libraryTarget: "amd",
		filename: "[name].web.js",
		path: path.resolve(__dirname, "dist"),
	},
};
const baseConfig = {
	entry: "./page/components/index.jsx",
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
						loader: "jsx", // Remove this if you're not using JSX
						target: "es2015", // Syntax to compile to (see options below for possible values)
					},
				},
			},
			{
				test: /\.css?$/,
				exclude: /(node_modules|bower_components)/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
	externals: {
		react: "react",
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
		new ESBuildPlugin(),
		new MiniCssExtractPlugin({
			filename: `css/[name].css`,
		}),
		new webpack.DefinePlugin({
			"process.env.TARGET": JSON.stringify(process.env.TARGET),
		}),
		new OptPlugin(),
	],
};

const serverConfig = Object.assign({}, baseConfig, output_node);
const clientConfig = Object.assign({}, baseConfig, output_web);
module.exports = [serverConfig, clientConfig];
