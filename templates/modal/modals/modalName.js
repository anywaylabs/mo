import modal from 'mo/modal';

function show(content) {
    return new Promise((resolve, reject) => {
        modal.show('{{modalName}}', {
            content
        }, {
            // Events go here.
            close: () => {
                modal.hide('{{modalName}}');
                resolve();
            }
        });
    });
}

function hide() {
    modal.hide('{{modalName}}');
}

export default {show, hide};