import modal from 'mo/modal';

function show(content) {
    return new Promise((resolve, reject) => {
        modal.show('info', {
            content
        }, {
            // Events go here.
            close: () => {
                modal.hide('info');
                resolve();
            }
        });
    });
}

function hide() {
    modal.hide('info');
}

export default {show, hide};