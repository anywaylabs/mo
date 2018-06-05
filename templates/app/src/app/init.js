// Require ASAP.
import 'global.less';
import store from 'mo/store';
import pages from 'mo/pages';
import pushNotifications from 'mo/pushNotifications';

import mo from 'mo/init';

mo()
    .then(() => {
        store.set('currentUser', {guest: true});
        pages.change('signIn');
        pushNotifications.init();
    });

/*
// Uncomment and setup this if you do need users authentication.

import auth from 'mo/auth';
import events from 'mo/events';

mo()
    .then(setupAuth);

function setupAuth() {
    auth.perform()
        .fail(() => {
            store.set('currentUser', {guest: true})
            pages.change('signIn')
        });

    events.on({
        'auth:login': () => {
            pages.change('home');
        },
        'auth:logout': () => {
            pages.change('signIn');
        }
    });
}
*/
