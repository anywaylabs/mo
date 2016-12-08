import BaseView from 'mo/views/Base';
import template from './home.hbs';
import './home.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
    }

    update(state) {
        this.state = state;
        this.render();
    }
};