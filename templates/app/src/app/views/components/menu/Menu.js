import Panel from 'mo/views/components/Panel';
import template from './menu.hbs';
import './menu.less';

class Menu extends Panel {
    constructor() {
        super(template);
    }
}

// Method `update` will be called when `currentUser` is changed in global `mo/store`.
Menu.storeSources = ['currentUser'];

module.exports = Menu;