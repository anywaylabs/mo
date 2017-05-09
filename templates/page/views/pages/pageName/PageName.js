import BaseView from 'mo/views/Base';
import template from './{{pageName}}.hbs';
import './{{pageName}}.less';

class {{PageName}} extends BaseView {
    constructor($el) {
        super($el, template);
        this.render();
        this._setupListeners();
    }

    update(state={}) {
        this.state = state;
        this.render();
        this._setupListeners();
    }

    _setupListeners() {
    }
}

module.exports = {{PageName}};
