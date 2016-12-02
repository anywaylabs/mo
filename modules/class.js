define(['lodash'], function (_) {
    function augment (childClass, parentClass, override) {
        childClass.prototype = (Object.create || function (obj) {
            function F () {}

            F.prototype = obj;
            return new F();
        })(parentClass.prototype);

        childClass.prototype.constructor = childClass;
        childClass.superclass = parentClass.prototype;
        childClass.superclass.constructor = parentClass;

        if (override) {
            _.extend(childClass.prototype, override);
        }

        return childClass.prototype;
    }

    function create (childClass, parentClass, override) {
        if (typeof parentClass == 'function') {
            augment(childClass, parentClass, override);
        } else {
            override = parentClass;
            _.extend(childClass.prototype, override);
        }

        return childClass;
    }
    
    return {
        augment: augment,
        create: create
    }
});