(function() {
    var depth = document.getElementById('depth');
    var branch = document.getElementById('branch');
    var runBtn = document.getElementById('run');
    var out = document.getElementById('res');
    
    var run = function() {
        gen.branch(branch.value).depth(depth.value);
        res.innerHTML = '';
        for (var i = 0; i < 30; i++) {
            var rande = gen();
            console.log(rande)
            res.innerHTML += rande + ' = ' + eval(rande) + '\n';
        }
    };

    runBtn.onclick = run;
    depth.onchange = run;
    branch.onchange = run;
    run();
}());
