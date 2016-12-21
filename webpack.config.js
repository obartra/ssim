const webpack = require('webpack');

module.exports = {
	entry: [
		'core-js/modules/es6.object.keys',
		'core-js/modules/es6.object.assign',
		'./index.js'
	],
	output: {
		path: __dirname,
		filename: 'dist/ssim.js',
		library: 'ssim',
		libraryTarget: 'umd'
	},
	target: 'node',
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel-loader'
		}, {
			test: /.json$/,
			loader: 'json-loader'
		}]
	},
	externals: {
		canvas: 'canvas'
	},
	plugins: [new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		sourceMap: false
	})]
};
