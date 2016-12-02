define(function () {

var helpers = {};

helpers.string = {
    dasherize: function(str){
        return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    undasherize: function(str){
        return str.replace(/-[a-z]/g, function (part) { return part.slice(1).toUpperCase(); })
    },

    parseQuery: function(string, separator) {
        var match = string.match(/([^?#]*)(#.*)?$/);
        if (!match) return { };

        return _(match[1].split(separator || '&')).reduce(function(hash, pair) {
            if ((pair = pair.split('='))[0]) {
                var key = decodeURIComponent(pair.shift()),
                    value = pair.length > 1 ? pair.join('=') : pair[0];

                if (value != undefined) value = decodeURIComponent(value);

                if (key in hash) {
                    if (!_.isArray(hash[key])) hash[key] = [hash[key]];
                    hash[key].push(value);
                }
                else hash[key] = value;
            }
            return hash;
        }, {});
    }
};

helpers.number = {
    roundScore: function (score, digitsAfterPoint) {
        digitsAfterPoint = (typeof digitsAfterPoint === 'undefined') ? 1 : digitsAfterPoint;

        if (score >= 1e6) {
            return (score / 1e6).toFixed(digitsAfterPoint).replace(/(\d{3,})\.\d+/, '$1') + 'M';
        } else if (score >= 1e3) {
            return (score / 1e3).toFixed(digitsAfterPoint).replace(/(\d{3,})\.\d+/, '$1') + 'K';
        }

        return score;
    }
}

return helpers;

});