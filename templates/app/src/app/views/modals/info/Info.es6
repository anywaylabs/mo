import BaseModalView from 'mo/views/modals/Base';
import template from './info.hbs';
import styles from './info.less';

module.exports = class extends BaseModalView {
    constructor($el) {
        super($el, template);
    }
};