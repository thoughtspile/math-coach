(function() {
    var depth = document.getElementById('depth');
    var mode = document.getElementById('mode');
    var runBtn = document.getElementById('run');
    var out = document.getElementById('res');

    var getStr = function(mode) {
        if (mode == 'expr') {
            var rande = gen();
            return rande + ' = ' + rande.value();
        }
        var rande = gen.eqn();
        return rande.eqn + ' | x = ' + rande.ans;
    };

    var run = function() {
        gen.depth(depth.value);
        res.innerHTML = '';
        for (var i = 0; i < 30; i++)
            res.innerHTML += getStr(mode.value) + '\n';
    };

    runBtn.onclick = run;
    mode.onchange = run;
    depth.onchange = run;
    run();
}());
