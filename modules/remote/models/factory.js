define([
    'lodash',
    './Base',
    '../../class'
], function (_, BaseRemoteModel, classTools) {
    function createClass (params) {
        if (typeof params.super != 'function') {
            params.super = BaseRemoteModel;
        }

        if (typeof params.construct != 'function') {
            params.construct = function () {
                params.super.apply(this, arguments);
            };
        }

        // Static properties.
        params.construct = _.extend(params.construct, params.super, params.staticMethods);

        params.construct.title = params.title;
        params.construct.url = params.url;
        params.construct.singular = params.singular || false;

        return classTools.create(params.construct, params.super, params.methods);
    }

    return {
        createClass: createClass
    };
});