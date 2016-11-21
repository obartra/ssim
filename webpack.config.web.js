const webpack = require('webpack');
const common = require('./webpack.config');

module.exports = Object.assign({}, common, {
	output: {
		path: __dirname,
		filename: 'dist/ssim.web.js',
		library: 'ssim',
		libraryTarget: 'umd'
	},
	target: 'web',
	devtool: 'source-map',
	resolve: {
		alias: {
			'./src/readpixels': './src/readpixels.web'
		}
	},
	plugins: [new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		sourceMap: false
	})]
});
