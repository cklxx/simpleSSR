import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptPlugin from "optimize-css-assets-webpack-plugin";
import { ESBuildPlugin, ESBuildMinifyPlugin } from "esbuild-loader";
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
// import TerserPlugin from "terser-webpack-plugin";
const nodeEnv = "node";
const output_node = {
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "../dist"),
		libraryTarget: "commonjs2",
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.TARGET": JSON.stringify(nodeEnv),
		}),
		// new ESBuildPlugin(),
		new MiniCssExtractPlugin({
			filename: `css/[name].css`,
		}),
		new OptPlugin(),
	],
};
const output_web = {
	output: {
		library: "[name]",
		libraryTarget: "amd",
		filename: "[name].web.js",
		path: path.resolve(__dirname, "../dist"),
	},
	plugins: [
		new MonacoWebpackPlugin({
			languages: ['json', 'javascript', 'typescript']
		}),
		// new ESBuildPlugin(),
		new MiniCssExtractPlugin({
			filename: `css/[name].css`,
		}),
		new OptPlugin(),
	],
};
const baseConfig = {
	watch: true,
	mode: 'production',
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
				test: /\.?jsx?$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
			{
				test: /\.ttf$/i,
				use: 'raw-loader',
			},
			{
				test: /\.css?$/,
				exclude: /(bower_components)/,
				use: ["css-loader",],
			},
			{
				test: /\.m?jsx?$/,
				exclude: /(bower_components)/,
				use: {
					loader: "esbuild-loader",
					options: {
						loader: "jsx", // Remove this if you're not using JSX
						target: "es2015", // Syntax to compile to (see options below for possible values)
					},
				},
			},

		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new ESBuildMinifyPlugin({
				target: "es2015", // Syntax to compile to (see options below for possible values)
			}),
		],
	},
};

export const getConfig = (entry: any[]) => {
	let configs: any[] = [];
	entry.forEach(e => {
		let externals = {
			react: 'react'
		} as any;
		if (e.runtime) {
			externals = {};
		}
		const serverConfig = Object.assign({}, { entry: e }, baseConfig, output_node, { externals });
		const clientConfig = Object.assign({}, { entry: e }, baseConfig, output_web, { externals });
		configs.push(serverConfig, clientConfig)
	})
	return configs;
};
