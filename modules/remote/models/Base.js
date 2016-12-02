define([
    'lodash',
    '../../connect',
    '../../class', '../../EventManager'
], function (_, connect, classTools, EventManager) {
    function RemoteModel (properties) {
        this.properties = properties || {};

        if (!this.properties.extra) {
            this.properties.extra = {};
        }

        this.events = new EventManager();
    }

    /**
     * @abstract
     * @type {string}
     */
    RemoteModel.title = '';

    /**
     * @abstract
     * @type {string}
     */
    RemoteModel.url = '';

    /**
     * @abstract
     * @type {boolean}
     */
    RemoteModel.singular = false;

    // TODO #89 cache
    RemoteModel.find = function (id, extra) {
        // Мы не можем передавать this как context, так как это конструктор: "function".
        var modelClass = this,
            url = this.singular ? modelClass.url : modelClass.url + '/' + id;

        return connect.get(url, { extra: extra }).then(function (data) {
            return new modelClass(data.result);
        });
    };

    RemoteModel.get = RemoteModel.find;

    RemoteModel.toData = function (collection) {
        return _.invoke(collection, 'getData');
    };

    classTools.create(RemoteModel, {
        getUrl: function () {
            return this.constructor.singular ?
                this.constructor.url :
                this.constructor.url + '/' + this.properties.id;
        },

        set: function (propertyOrHash, value) {
            if (typeof propertyOrHash == 'string') {
                this.properties[propertyOrHash] = value;
            } else {
                this.properties = _.extend(this.properties, propertyOrHash);
            }

            this.events.trigger('change');

            return this;
        },

        create: function () {
            if (this.constructor.singular) {
                return vow.reject('Can\'t create singular resource.');
            }

            var params = {};
            params[this.constructor.title] = this.properties;

            return connect['post'](this.constructor.url, params).then(function () { return this; }, this);
        },

        update: function () {
            var params = {};
            params[this.constructor.title] = this.properties;

            return connect['put'](this.getUrl(), params).then(function () { return this; }, this);
        },

        save: function () {
            return this.properties.id || this.constructor.singular ? this.update() : this.create();
        },

        reload: function () {
            return connect.get(this.getUrl(), { extra: _.keys(this.properties.extra) }).then(function (data) {
                this.properties = data.result;

                if (!this.properties.extra) {
                    this.properties.extra = {};
                }

                this.events.trigger('change');

                return this;
            }, this);
        },

        delete: function () {
            return connect.delete(this.getUrl());
        },

        action: function (action, method, params) {
            return connect[method || 'get'](this.getUrl() + '/' + action, params);
        },

        getData: function (skipHelpers) {
            var data = _.clone(this.properties);

            if (!skipHelpers && typeof this.getHelpers == 'function') {
                data.helpers = this.getHelpers();
            }

            return data;
        },

        reset: function () {
            this.properties = { extra: {} };
            this.events.trigger('change');
        }
    });

    return RemoteModel;
});