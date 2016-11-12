const webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		path: __dirname,
		filename: 'dist/ssim.js',
		library: '[name]',
		libraryTarget: 'umd'
	},
	target: 'node',
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel'
		}, {
			test: /.json$/,
			loader: 'json'
		}]
	},
	devtool: 'source-map',
	externals: {
		canvas: 'canvas'
	},
	plugins: [new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		sourceMap: true
	})]
};
