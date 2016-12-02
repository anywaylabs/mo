// This is used to require jqm with Webpack.
module.exports = function (source) {
    return '(function () {' + source + ';}).call(window);';
};