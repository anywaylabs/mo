import BaseView from 'mo/views/Base';
import template from './{{pageName}}.hbs';
import './{{pageName}}.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
        this.update();
    }

    update(state) {
        this.state = state;
        this.render();
        this._setupListeners();
    }

    _setupListeners() {
    }
};