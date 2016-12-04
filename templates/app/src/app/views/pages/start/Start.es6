import BaseView from 'mo/views/Base';
import template from './start.hbs';
import './start.less';

module.exports = class extends BaseView {
    constructor($el) {
        super($el, template);
    }

    update(state) {
        this.state = state;
        this.render();
    }
};