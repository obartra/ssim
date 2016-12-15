const common = require('./webpack.config.web');

module.exports = Object.assign({}, common, {
	entry: './spec/web/web.spec.js',
	output: {
		path: __dirname,
		filename: 'spec/web/web.build.js',
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
