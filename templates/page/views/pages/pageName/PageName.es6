import BaseView from 'mo/views/Base';
import template from './{{pageName}}.hbs';
import './{{pageName}}.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
    }

    build(content) {
        this.update(content);

        this._setupListeners();
    }

    clear() {
        this._clearListeners();

        this.update(null);
    }
};