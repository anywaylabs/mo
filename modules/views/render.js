define([
    'lodash', 'jquery',
    'config',
    '../env', '../assets'
], function (_, $, config, env, assets) {

// Handlebars = Handlebars['default'];
//
// Handlebars.registerHelper('config', function (key) {
//     var keys = key.split('.'),
//         value = config;
//
//     while (key = keys.shift()) {
//         value = value[key];
//     }
//
//     return value;
// });
//
// Handlebars.registerHelper('assets-dir', function () {
//     return assets.getDir();
// });
//
// Handlebars.registerHelper('hd', function (filename) {
//     return getHdImage(filename);
// });
//
// Handlebars.registerHelper('inc-index', function (value) {
//     return parseInt(value) + 1;
// });
//
// Handlebars.registerHelper('dec-index', function (value) {
//     return parseInt(value) - 1;
// });
//
// Handlebars.registerHelper('get-days-left', function (value) {
//     var days = ['день', 'дня', 'дней'],
//         left = ['Остался', 'Осталось'],
//         mod = value % 10;
//
//     if ((value % 100) >= 10 && (value % 100) <= 19) {
//         return left[1] + ' ' + value + ' ' + days[2];
//     }
//
//     if (mod == 1) {
//         return left[0] + ' ' + value + ' ' + days[0];
//     }
//
//     if (mod >= 2 && mod <= 4) {
//         return left[1] + ' ' + value  + ' ' + days[1];
//     }
//
//     return left[1] + ' ' + value + ' ' + days[2];
// });
//
// Handlebars.registerHelper('times', function (n, block) {
//     var accum = '';
//
//     for(var i = 0; i < n; ++i) {
//         accum += block.fn(i);
//     }
//
//     return accum;
// });
//
// Handlebars.registerHelper('ifFromChanged', function (parent, options) {
//     if (parent._lastFromId != this.from.id) {
//         parent._lastFromId = this.from.id;
//         return options.fn(this);
//     }
//
//     return options.inverse(this);
// });
//
// _.each(templates, function (template, key) {
//     if (key[0] == '_' || key.indexOf('/_') != -1) {
//         Handlebars.registerPartial(key, template);
//     }
// });
//
// function getHdImage (filename) {
//     return env.supports.hd ? filename + 'x2' : filename;
// }

return function (template, context) {
    return template(_.extend(context, { __config: config, __env: env }));
}

});