const webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		path: __dirname,
		filename: 'dist/ssim.js',
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
	plugins: [new webpack.optimize.UglifyJsPlugin()]
};
