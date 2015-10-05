var fs = require('fs');
var gen = require('./index.js');

gen.branch(4).depth(3);
var eqns = '';
for (var i = 0; i < 100; i++) {
    var rande = gen();
    eqns += rande + ' = ' + eval(rande) + '\n';
}
fs.writeFileSync(__dirname + '\\problems.txt', eqns);
