var webpack = require('webpack');
var path = require('path');
var ip = require('ip');
var lessGlob = require('less-plugin-glob');

module.exports = {
    entry: {
        app: ['./src/app/init.es6'],
        vendor: ['jquery', 'lodash', 'mo/jqm', 'mo/socket.io', 'webpack-hot-middleware/client?reload=true']
    },
    module: {
        loaders: [{
            test: /\.es6/,
            loader: 'babel'
        }, {
            test: /\.hbs/,
            loader: 'handlebars-loader'
        }, {
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            test: /\.css/,
            loader: 'style!css'
        }, {
            test: /\.(jpg|png|svg|gif)/,
            loader: 'url'
        }, {
            test: /jquery.mobile-/,
            loader: '../loaders/context-window'
        }]
    },
    resolve: {
        // TODO Get rid of .es6
        extensions: ['', '.js', '.es6'],
        modulesDirectories: [
            'node_modules',
            'templates',
            'styles',
            // Absolute path is for mo to access user modules.
            path.resolve(__dirname, 'src/app')
        ],
        alias: {
            mo: 'mo-framework/modules'
        }
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/src',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
        new webpack.HotModuleReplacementPlugin()
    ],
    lessLoader: {
        lessPlugins: [lessGlob]
    }
};