import intro from 'intro.less';
import global from 'global.less';

import mo from 'mo/init';
import auth from 'mo/auth';
import events from 'mo/events';
import pages from 'mo/pages';
import pushNotifications from 'mo/pushNotifications';

mo()
    // Remove this if you don't need users authentication.
    .then(setupAuth);

function setupAuth () {
    auth.perform()
        .fail(() => {
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
