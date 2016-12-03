import popup from 'mo/popup';
import BasePage from 'mo/pages/Base';
import modal from 'mo/modal';
import pages from 'mo/pages';

module.exports = class extends BasePage {
    constructor(name, viewClass) {
        const viewEvents = {
            buttonclick: (e, {user}) => popup.show(`Hello, ${user}!`)
        };

        super(name, viewClass, viewEvents);
    }

    // Hooks go here.
    
    onBeforeShow() {
        this.view.update({
            date: new Date().toString().match(/\d{2}:\d{2}:\d{2}/)[0]
        });

        modal.show('info', 'You need to sign in!');

        setTimeout(() => pages.change('signIn'), 2000);
    }

    onShow() {
    }

    onBeforeHide() {
        modal.hide('info');
    }

    onHide() {
    }
};