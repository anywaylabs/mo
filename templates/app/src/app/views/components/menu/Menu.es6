import Panel from 'mo/views/components/Panel';
import template from './Menu.hbs';
import styles from './menu.less';

module.exports = class extends Panel {
    constructor() {
        super(template);
    }
};