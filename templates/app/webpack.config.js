const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options = {}) => {
    const webpackConfig = {
        entry: {
            app: [
                './src/app/init.es6',
                './src/index.html'
            ],
            vendor: [
                'jquery', 'lodash',
                'mo/jqm', 'mo/bouncefix',
                'immutable', 'vow', 'socket.io-client'
                //, 'handlebars'
            ]
        },

        resolve: {
            // TODO Get rid of .es6
            extensions: ['.js', '.es6'],
            modules: [
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
        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js'})
        ],
        output: {
            path: __dirname + '/build',
            publicPath: '',
            filename: 'app.js'
        },
        module: {
            // rules
            loaders: [{
                test: /\.es6/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.hbs/,
                loader: 'handlebars-loader'
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!less-loader'})
            }, {
                test: /\.(jpg|png|svg|gif)/,
                loader: 'url-loader?limit=50000'
            }, {
                test: /index\.html/,
                loader: 'file-loader?name=index.html'
            }, {
                test: /\.(eot|ttf|woff|wav|mp3)/,
                loader: 'file-loader'
            }, {
                test: /\.css/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            }, {
                test: /jquery.mobile-/,
                loader: 'mo/loaders/context-window'
            }]
        }
    };

    if (options.dev) {
        webpackConfig.devtool = 'source-map';
        webpackConfig.entry.vendor.push(
            'webpack-hot-middleware/client?reload=true'
        );
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
        webpackConfig.output.pathinfo = true;

    } else if (options.prod) {
        webpackConfig.devtool = false;
        webpackConfig.plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': 'production'
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    return webpackConfig;
};
