define([
    'lodash', 'vow',
    '../../connect',
    '../../class', '../../EventManager'
], function (_, vow, connect, classTools, EventManager) {
    function RemoteCollection (params) {
        this._params = params || {};

        this.events = new EventManager();

        this._scopesPromises = {};
    }

    /**
     * @abstract
     */
    RemoteCollection.url = '';

    RemoteCollection.modelClass = null;

    return classTools.create(RemoteCollection, {
        where: function (filter, reload, toData) {
            var scopeId = this._serializeParams(filter, '_all');

            if (reload) {
                var params = filter && typeof filter != 'function' ? _.extend({}, this._params, filter) : this._params;

                this._scopesPromises[scopeId] = connect.get(this.constructor.url, params).then(function (data) {
                    return filter && typeof filter == 'function' ? _.filter(data.result, filter, this) : data.result;
                }, this);
            } else if (!this._scopesPromises[scopeId]) {
                if (this._scopesPromises._all) {
                    this._scopesPromises[scopeId] = this._scopesPromises._all.then(function (all) {
                        return typeof filter == 'function' ? _.filter(all, filter, this) : _.where(all, filter);
                    }, this);
                } else {
                    return this.where(filter, true, toData);
                }
            }

            return typeof this.constructor.modelClass != 'function' ?
                this._scopesPromises[scopeId] :
                this._scopesPromises[scopeId].then(function (results) {
                    return this._wrapModels(results, toData);
                }, this);
        },

        firstWhere: function (filter, reload, toData) {
            return this.where(filter, reload, toData).then(function (results) {
                return results.length ? results[0] : vow.reject();
            });
        },

        getAll: function (reload, toData) {
            if (reload) {
                this._scopesPromises = {};
            }

            return this.where(null, reload, toData);
        },

        _serializeParams: function (params, defaultValue) {
            if (!params) {
                return defaultValue;
            } else {
                switch (typeof params) {
                    case 'function' : return params.toString();
                    case 'object' : return JSON.stringify(params);
                    default : return params;
                }
            }
        },

        _wrapModels: function (results, toData) {
            if (!results.length) {
                return results;
            }

            return _.map(results, function (row) {
                var object = new this.constructor.modelClass(row);

                return toData ? object.getData() : object;
            }, this);
        }
    });
});