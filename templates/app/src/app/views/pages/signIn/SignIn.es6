import BaseView from 'mo/views/Base';
import template from './signIn.hbs';
import './signIn.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
    }

    update(state) {
        this.state = state;
        this.render();
        this.setupListeners();
    }

    setupListeners() {
        this.$('a').on('vclick', () => {
            this.events.trigger('buttonclick', { user: 'mo developer' })
        });
    }
};