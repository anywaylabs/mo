import BasePage from 'mo/pages/Base';
import pages from 'mo/pages';
import modalInfo from '../modals/info';

module.exports = class extends BasePage {
    constructor(name, viewClass) {
        super(name, viewClass, {
            // View events go here.
        });
    }

    // Hooks go here.

    onBeforeShow() {
        this.view.update({
            date: new Date().toString().match(/\d{2}:\d{2}:\d{2}/)[0]
        });

        modalInfo.show('You need to sign in!');

        setTimeout(pages.back, 2000);
    }

    onShow() {
    }

    onBeforeHide() {
        modalInfo.hide();
    }

    onHide() {
    }
};