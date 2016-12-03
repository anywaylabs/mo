import BaseView from 'mo/views/Base';
import template from './signIn.hbs';
import './signIn.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
    }

    build(content) {
        this.update(content);

        this.$('a').on('vclick', () => this._onClick());
    }

    clear() {
        this.update();
        
        this.$('a').off('vclick');
    }

    _onClick() {
        this.events.trigger('buttonclick', { user: 'mo developer' })
    }
};