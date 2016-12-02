define([
    './factory'
], function (remoteModelsFactory) {
    return remoteModelsFactory.createClass({
        title: 'device',
        url: '/devices'
    });
});