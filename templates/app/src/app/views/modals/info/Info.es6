import BaseModalView from 'mo/views/modals/Base';
import template from './info.hbs';
import './info.less';

class Info extends BaseModalView {
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

module.exports = Info;