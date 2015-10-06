(function() {
    var randi = function(max) {
        return Math.floor(max * Math.random());
    };

    var addParens = function(str) {
        return '(' + str + ')';
    };

    var divides = function(fac, prod) {
        var div = prod / fac;
        return Math.floor(div) == div;
    }

    var isPrime = function(val) {
        for (var i = 2; i <= Math.sqrt(val); i++)
            if (divides(i, val))
                return false;
        return true;
    };

    var factorize = function(val, restr) {
        if (val < 0)
            return [-1].concat(factorize(-val));
        for (var i = restr || 2; i <= Math.sqrt(val); i++)
            if (divides(i, val) && isPrime(i))
                return [i].concat(factorize(val / i, i));
        return [val];
    };

    var rSubset = function(arr) {
        var count = Math.random() * arr.length;
        return arr.filter(function() {
            return Math.random() < count / arr.length;
        });
    };


    var config = {
        ops: ['+', '-', '*'],
        depth: 3,
        range: [0, 10],
        priorities: {
            '+': 3,
            '-': 2,
            '*': 1,
            '/': 1
        },
        inverse: {
            '+': '-',
            '-': '+',
            '*': '/',
            '/': '*'
        }
    };


    var exprTree = function(children, op) {
        if (!(this instanceof exprTree))
            return new exprTree(children, op);
        this.children = Array.isArray(children)? children: [children];
        this.op = op;
        this.priority = config.priorities[op] || -1;
    }

    exprTree.prototype.toString = function() {
        var selfPriority = this.priority;
        return this.children.map(function(sub) {
            return sub.priority > selfPriority? addParens(sub): sub;
        }).join(this.op);
    };

    exprTree.prototype.value = function() {
        return eval(this.toString());
    };


    var gen = function(depth) {
        if (typeof depth == 'undefined')
            depth = config.depth;
        if (depth == 0)
            return exprTree(randi(16), '');
        return exprTree(
            [gen(randi(depth)), gen(randi(depth))],
            config.ops[randi(config.ops.length)]);
    };

    gen.to = function(val) {
        var op = config.ops[randi(config.ops.length)];
        if (op !== '*') {
            var left = gen(0);
            children = [gen.to(eval(val + config.inverse[op] + left)), left];
        } else {
            children = factorize(val);
        }
        return exprTree(children, op);
    };

    gen.eqn = function() {
        var left = gen();
        var right = left.value();
        var letter = left;
        while (letter.children.length > 1)
            letter = letter.children[randi(letter.children.length)];
        var ans = letter.children[0];
        letter.children[0]  = 'x';
        return {eqn: left + ' = ' + right, ans: ans};
    };

    Object.keys(config).forEach(function(key) {
        gen[key] = function(override) {
            config[key] = override !== null? override: config[key];
            return this;
        };
    });


    if (typeof module !== 'undefined' && module.exports)
        module.exports = gen;
    if (typeof window !== 'undefined')
        window.gen = gen;
}());
