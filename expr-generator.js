var gen = (function() {
    var randi = function(max) {
        return Math.floor(max * Math.random());
    };

    var addParens = function(str) {
        return '(' + str + ')';
    };


    var config = {
        ops: ['+', '-', '*'],
        depth: 3,
        range: [0, 10],
        priorities: {
            '+': 2,
            '-': 2,
            '*': 1,
            '/': 1
        }
    };

    var toString = function() {
        var selfPriority = this.priority;
        return this.children.map(function(sub) {
            return sub.priority > selfPriority? addParens(sub): sub;
        }).join(this.op);
    };

    var rgen = function(depth) {
        if (depth == 0)
            return {
                children: [randi(16)],
                toString: toString,
                op: '',
                priority: 1
            };

        var op = config.ops[randi(config.ops.length)];
        var selfPriority = config.priorities[op];
        var children = [rgen(randi(depth)), rgen(randi(depth))];

        return {
            children: children,
            op: op,
            priority: selfPriority,
            toString: toString
        };
    };

    var gen = function() {
        return rgen(config.depth);
    };

    Object.keys(config).forEach(function(key) {
        gen[key] = function(override) {
            config[key] = override !== null? override: config[key];
            return this;
        };
    });


    return gen;
}());

if (typeof module !== 'undefined' && module.exports)
    module.exports = gen;
