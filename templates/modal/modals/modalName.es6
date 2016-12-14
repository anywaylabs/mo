import modal from 'mo/modal';

function show() {
    return new Promise((resolve, reject) => {
        modal.show('{{modalName}}', {
            content: 'Content goes here'
        }, {
            // Events go here.
            close: () => {
                modal.hide('{{modalName}}');
                resolve();
            }
        });
    });
}

export default {show};