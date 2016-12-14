var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ['./src/app/init.es6', './src/index.html'],
        vendor: [
            'jquery', 'lodash',
            'mo/jqm', 'mo/bouncefix',
            'immutable', 'vow', 'socket.io-client',
            'webpack-hot-middleware/client?reload=true'
            //, 'handlebars'
        ]
    },
    module: {
        loaders: [{
            test: /\.es6/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.hbs/,
            loader: 'handlebars-loader'
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
        }, {
            test: /\.(jpg|png|svg|gif)/,
            loader: 'url-loader?limit=50000'
        }, {
            test: /index\.html/,
            loader: 'file-loader?name=index.html'
        }, {
            test: /\.(eot|ttf|woff)/,
            loader: 'file-loader'
        }, {
            test: /\.css/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
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
            path.resolve(__dirname, 'src/app'),
            path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            mo: 'mo-framework/modules'
        }
    },
    output: {
        path: __dirname + '/build',
        publicPath: '',
        filename: 'app.js'
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new webpack.HotModuleReplacementPlugin()
    ]
};
