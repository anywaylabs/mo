import Panel from 'mo/views/components/Panel';
import template from './Menu.hbs';
import styles from './menu.less';

class Menu extends Panel {
    constructor() {
        super(template);
    }
}

Menu.storeSources = ['currentUser'];

module.exports = Menu;