var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        app: ['./src/app/init.es6'],
        vendor: [
            'jquery', 'lodash',
            'mo/jqm', 'mo/bouncefix',
            'immutable', 'vow', 'socket.io-client'
            //, 'handlebars'
        ]
    },
    module: {
        loaders: [{
            test: /\.es6/,
            loader: 'babel-loader'
        }, {
            test: /\.hbs/,
            loader: 'handlebars-loader'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.(jpg|png|svg|gif)/,
            loader: 'url-loader?limit=50000'
        }, {
            test: /\.(eot|ttf|woff)/,
            loader: 'file-loader'
        }, {
            test: /\.css/,
            loader: 'style-loader!css'
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
    ]
};