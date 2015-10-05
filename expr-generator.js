var gen = (function() {
    var randi = function(max) {
        return Math.floor(max * Math.random());
    };

    var addParens = function(str) {
        return '(' + str + ')';
    };


    var config = {
        ops: ['+', '-', '*'],
        branch: 2,
        depth: 3,
        range: [0, 10],
        priorities: {
            '+': 2,
            '-': 2,
            '*': 1,
            '/': 1
        }
    };

    var rgen = function(depth) {
        if (depth == 0)
            return {expr: randi(16), priority: 1};

        var branch = 2 + randi(config.branch - 2);
        var expr = '';
        var priority = 10;
        var adjacentPriorities = [10, 10];
        for (var i = 0; i < branch; i++) {
            var chunk = rgen(randi(depth));
            adjacentPriorities[0] = adjacentPriorities[1];
            var nextOp = i == branch - 1?
                '':
                config.ops[randi(config.ops.length)];
            adjacentPriorities[1] = config.priorities[nextOp] || 10;
            var priority = Math.min(priority, adjacentPriorities[1]);
            if (chunk.priority > Math.min.apply(null, adjacentPriorities))
                chunk.expr = addParens(chunk.expr);
            expr += chunk.expr + nextOp;
        }
        
        return {expr: expr, priority: priority};
    };

    var gen = function() {
        return rgen(config.depth).expr;
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
