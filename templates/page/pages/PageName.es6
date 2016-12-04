import BasePage from 'mo/pages/Base';

module.exports = class extends BasePage {
    constructor(name, viewClass) {
        super(name, viewClass, {
            // View events go here.
        });
    }

    // Hooks go here.

    onBeforeShow() {
        // this.view.update(state);
    }

    onShow() {
    }

    onBeforeHide() {
    }

    onHide() {
    }
};
