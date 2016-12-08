var immutable = require('immutable');

var state = immutable.fromJS({});
var observers = [];

function init(initialState) {
    state = immutable.fromJS(initialState);
}

function getAll() {
    return state.toJS();
}

function get(path) {
    var val = state.getIn(path.split('.'));
    return (val && typeof val.toJS == 'function') ? val.toJS() : val;
}

function set(path, value) {
    var old = state;
    state = old.setIn(path.split('.'), immutable.fromJS(value));
    onUpdate(old);
}

function unset(path) {
    var old = state;
    state = old.deleteIn(path.split('.'));
    onUpdate(old);
}

function observe(targets, cb) {
    if (!Array.isArray(targets)) {
        targets = targets ? [targets] : [];
    }

    observers.push({cb: cb, targets: targets});
}

function onUpdate(old) {
    observers.forEach(function (observer) {
        var targets = observer.targets,
            cb = observer.cb;

        for (var i = 0, l = targets.length, path; i < l; i++) {
            path = observer.targets[i].split('.');
            if (old.getIn(path) !== state.getIn(path)) {
                cb(getAll());
                break;
            }
        }
    });
}

module.exports = {
    init: init,
    getAll: getAll,
    get: get,
    set: set,
    unset: unset,
    observe: observe
};