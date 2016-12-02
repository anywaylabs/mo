import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import ip from 'ip';

export default function (params) {
    const webpackConfig = require(path.join(params.source, 'webpack.config.js'));
    const publicPath = webpackConfig.output.publicPath;
    const publicPathAbsolute = path.join(params.source, publicPath);
    const assetsPath = path.resolve(__dirname, './assets/');
    const compiler = webpack(webpackConfig);
    const localIp = ip.address();
    const port = 7777;

    express()
        .use(webpackDevMiddleware(compiler, {publicPath, stats: {colors: true}}))
        .use(webpackHotMiddleware(compiler))
        .use(publicPath, express.static(publicPathAbsolute))
        .use(express.static(assetsPath))
        .listen(port, (err) => {
            if (err) {
                console.error(err)
            } else {
                console.log(`\n\nYour mo 🐍  server is ready. Ctrl+click => http://${localIp}:${port} !\n\n`);
            }
        });
}