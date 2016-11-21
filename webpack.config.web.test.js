const common = require('./webpack.config.web');

module.exports = Object.assign({}, common, {
	entry: './spec/web/live.spec.js',
	output: {
		path: __dirname,
		filename: 'spec/web/live.build.js',
		library: 'ssimTest',
		libraryTarget: 'var'
	},
	resolve: {},
	externals: {
		tape: 'tape',
		'tape-dom': 'tapeDom'
	},
	devtool: false,
	plugins: []
});
