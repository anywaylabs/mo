import BaseModalView from 'mo/views/modals/Base';
import template from './{{modalName}}.hbs';
import './{{modalName}}.less';

class {{ModalName}} extends BaseModalView {
    constructor($el) {
        super($el, template);
    }
    
    update(state={}) {
        super.update(state);
        this._setupListeners()
    }

    _setupListeners() {
    }
}

module.exports = {{ModalName}};