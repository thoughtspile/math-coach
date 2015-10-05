var fs = require('fs');

var gen = (function() {
    var randi = function(max) {
        return Math.floor(max * Math.random());
    };


    var config = {
        ops: ['+', '-', '*'],
        branch: 2,
        depth: 3,
        range: [0, 10]
    };

    var rgen = function(depth) {
        if (depth == 0)
            return randi(16);
        var branch = 2 + randi(config.branch - 2);
        var expr = '(';
        for (var i = 0; i < branch; i++) {
            expr += rgen(randi(depth));
            if (i !== branch - 1)
                expr += config.ops[randi(config.ops.length)];
        }
        expr += ')';
        return expr;
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

gen.branch(4).depth(3);
var eqns = '';
for (var i = 0; i < 100; i++) {
    var rande = gen();
    eqns += rande + ' = ' + eval(rande) + '\n';
}
fs.writeFileSync(__dirname + '\\problems.txt', eqns);
