var fs = require('fs');
var gen = require('./expr-generator.js');

gen.depth(3);
var eqns = '';
for (var i = 0; i < 100; i++) {
    var rande = gen();
    eqns += rande + ' = ' + eval(rande) + '\n';
}

fs.writeFileSync(__dirname + '\\problems.txt', eqns);
