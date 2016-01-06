(function() {
    // utility

    // random integer in range [0, max)
    var randi = function(max) {
        return Math.floor(max * Math.random());
    };

    // wrap string in parentheses
    var addParens = function(str) {
        return '(' + str + ')';
    };

    // true iff fac divides prod
    var divides = function(fac, prod) {
        var div = prod / fac;
        return Math.floor(div) == div;
    }

    // true iff val is a prime number
    var isPrime = function(val) {
        for (var i = 2; i <= Math.sqrt(val); i++)
            if (divides(i, val))
                return false;
        return true;
    };

    // returns the array of prime factors of val (in ascending order)
    // at each iteration adds the smallest factor not less than restr
    // works for negative numbers
    var factorize = function(val, restr) {
        if (val < 0)
            return [-1].concat(factorize(-val));
        for (var i = restr || 2; i <= Math.sqrt(val); i++)
            if (divides(i, val) && isPrime(i))
                return [i].concat(factorize(val / i, i));
        return [val];
    };

    // returns a random subset
    // statistical properties unknown
    var rSubset = function(arr) {
        var count = Math.random() * arr.length;
        return arr.filter(function() {
            return Math.random() < count / arr.length;
        });
    };


    // private static config object
    var config = {
        ops: ['+', '-', '*', '/'],
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


    // AST constructor, accepts array of children and operation
    var AST = function(children, op) {
        if (!(this instanceof AST))
            return new AST(children, op);
        this.children = Array.isArray(children)? children: [children];
        this.op = op;
        this.priority = config.priorities[op] || -1;
    }

    // convert to string
    AST.prototype.toString = function() {
        var selfPriority = this.priority;
        return this.children.map(function(sub) {
            return sub.priority > selfPriority? addParens(sub): sub;
        }).join(this.op);
    };

    // calculate (numeric) value
    AST.prototype.value = function() {
        return eval(this.toString());
    };


    // recursively generate a random AST with height <= depth
    var gen = function(depth) {
        if (typeof depth == 'undefined')
            depth = config.depth;
        if (depth == 0)
            return AST(randi(16), '');
        return AST(
            [gen(randi(depth)), gen(randi(depth))],
            config.ops[randi(config.ops.length)]);
    };

    // generate a random AST with value val
    gen.to = function(val) {
        var op = config.ops[randi(config.ops.length)];
        var children = null;
        if (op !== '*') {
            var left = gen(0);
            children = [gen.to(eval(val + config.inverse[op] + left)), left];
        } else {
            var factors = factorize(val);
            var left = rSubset(factors).reduce(function(acc, val) {
              return acc * val;
            }, 1);
            children = [gen.to(left), Math.floor(val / left)];

        }
        return AST(children, op);
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

    // chain syntax
    Object.keys(config).forEach(function(key) {
        gen[key] = function(override) {
            if (override !== null) {
              config[key] = override;
              return this;
            } else {
              return config[key];
            }
        };
    });

    // runtime-agnostic export
    if (typeof module !== 'undefined' && module.exports)
        module.exports = gen;
    if (typeof window !== 'undefined')
        window.gen = gen;
}());
