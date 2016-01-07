(function() {
    var depth = document.getElementById('depth');
    var mode = document.getElementById('mode');
    var runBtn = document.getElementById('run');
    var out = document.getElementById('res');

    var getStr = function(mode) {
        if (mode == 'expr') {
            var rande = gen();
            return rande + ' | ' + rande.value();
        }
        var rande = gen.eqn();
        return rande.eqn + ' | ' + rande.ans;
    };

    var run = function() {
        gen.depth(depth.value)
            .range([-200, 200]);
        res.innerHTML = _.range(30)
            .map(getStr.bind(null, mode.value))
            .join('\n');
    };

    runBtn.onclick = run;
    mode.onchange = run;
    depth.onchange = run;
    run();
}());
