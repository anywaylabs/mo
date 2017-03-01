// Require ASAP.
import global from 'global.less';

import mo from 'mo/init';
import auth from 'mo/auth';
import store from 'mo/store';
import events from 'mo/events';
import pages from 'mo/pages';
import pushNotifications from 'mo/pushNotifications';

mo()
    // Remove this if you don't need users authentication.
    .then(setupAuth);

function setupAuth () {
    auth.perform()
        .fail(() => {
            store.set('currentUser', {guest: true})
            pages.change('signIn')
        });

    events.on({
        'auth:login': () => {
            pushNotifications.init();
            pages.change('home');
        },
        'auth:logout': () => {
            pages.change('signIn');
        }
    });
}
