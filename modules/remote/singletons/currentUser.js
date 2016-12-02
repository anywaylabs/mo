define([
    'lodash', 'vow',
    '../../connect', '../../popup', '../../analytics', '../../modal',
    '../models/factory'
], function (
    _, vow,
    connect, popup, analytics, modal,
    remoteModelsFactory
) {
    var CurrentUser = remoteModelsFactory.createClass({
            title: 'user',
            url: '/account',
            singular: true,
            methods: {
                isGuest: function () {
                    return !('id' in this.properties);
                }
            }
        });

    return new CurrentUser();
});