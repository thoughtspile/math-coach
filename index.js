(function() {
    var depth = document.getElementById('depth');
    var runBtn = document.getElementById('run');
    var out = document.getElementById('res');

    var run = function() {
        gen.depth(depth.value);
        res.innerHTML = '';
        for (var i = 0; i < 30; i++) {
            var rande = gen() + '';
            res.innerHTML += rande + ' = ' + eval(rande) + '\n';
        }
    };

    runBtn.onclick = run;
    depth.onchange = run;
    run();
}());
