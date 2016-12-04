import BasePage from 'mo/pages/Base';

module.exports = class extends BasePage {
    constructor(name, viewClass) {
        super(name, viewClass, {
            // View events go here.
        });

        this.view.render();
    }

    // Hooks go here.

    onBeforeShow() {
    }

    onShow() {
    }

    onBeforeHide() {
    }

    onHide() {
    }
};
