define([
    'lodash', 'jquery',
    'config',
    'handlebars/runtime',
    '../store', '../env'
], function (_, $, config, Handlebars, store, env) {

    Handlebars = Handlebars['default'];

    Handlebars.registerHelper('ifeq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('inc-index', function (value) {
        return parseInt(value) + 1;
    });

    Handlebars.registerHelper('dec-index', function (value) {
        return parseInt(value) - 1;
    });

    Handlebars.registerHelper('times', function (n, block) {
        var accum = '';

        for(var i = 0; i < n; ++i) {
            accum += block.fn(i);
        }

        return accum;
    });

    return function (template, context) {
        return template(_.extend({}, store.getAll(), context, { __config: config, __env: env, __store: store.getAll() }));
    }

});
