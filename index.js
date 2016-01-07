(function() {
    var depth = document.getElementById('depth');
    var mode = document.getElementById('mode');
    var runBtn = document.getElementById('run');
    var ans = document.getElementById('ans');
    var out = document.getElementById('res');

    var getStr = function(mode, showAns) {
        if (mode == 'expr') {
            var rande = gen();
            return rande + (showAns? ' | ' + rande.value(): '');
        } else if (mode == 'eqn') {
            var rande = gen.eqn();
            return rande.eqn + (showAns? ' | ' + rande.ans: '');
        }
    };

    var run = function() {
        gen.depth(depth.value)
            .range([-200, 200]);
        res.innerHTML = [1,2,3,4,5,6]
            .map(getStr.bind(null, mode.value, ans.checked))
            .join('\n');
    };

    runBtn.onclick = run;
    mode.onchange = run;
    depth.onchange = run;
    ans.onchange = run;

    run();
}());

(function() {
    var tabGameCtrl = document.getElementById('tab-game');
    var tabGame = document.getElementsByClassName('game')[0];
    var tabWorksheetCtrl = document.getElementById('tab-worksheet');
    var tabWorksheet = document.getElementsByClassName('worksheet')[0];

    tabGameCtrl.onclick = function() {
        tabWorksheet.style.display = 'none';
        tabGame.style.display = 'inherit';
    }
    tabWorksheetCtrl.onclick = function() {
        tabWorksheet.style.display = 'inherit';
        tabGame.style.display = 'none';
    }
}());

(function() {
    var problemView = document.getElementById('game-problem');
    var ansView = document.getElementById('game-ans');
    var groupView = document.getElementById('game-group');
    var problem = null;

    var gameScreenView = document.getElementById('game-ui');
    var winScreenView = document.getElementById('game-win');
    var failScreenView = document.getElementById('game-fail');

    var invalid = ' has-error';
    var valid = ' has-success';
    var flashDuration = 1000;

    var lesson = {
        done: 0,
        todo: 3,
        hearts: 3
    };


    function mkProblem() {
        var rande = gen();
        return {problem: rande, ans: rande.value()};
    }

    function run() {
        problem = mkProblem();
        katex.render(problem.problem.toString() + '=', problemView);
        ansView.value = '';
        console.log(problem.ans)
    }

    function test() {
        console.log(lesson)
        if (parseFloat(ansView.value) == problem.ans) {
            run();
            flashValidity('valid');
            lesson.done++;
            lesson.todo--;
            if (lesson.todo == 0)
                win();
        } else {
            flashValidity('invalid');
            lesson.lives--;
            if (lesson.lives < 0)
                fail();
        }
    }


    function flashValidity(state) {
        if (!state) {
            groupView.className = groupView.className.replace(invalid, '').replace(valid, '');
            return;
        }
        if (state == 'valid' && groupView.className.indexOf(valid) == -1)
            groupView.className = groupView.className.replace(invalid, '') + valid;
        else if (state == 'invalid' && groupView.className.indexOf(invalid) == -1)
            groupView.className = groupView.className.replace(valid, '') + invalid;
        window.setTimeout(flashValidity.bind(null, ''), flashDuration);
    }


    function fail() {
        gameScreenView.style.display = 'none';
        winScreenView.style.display = 'none';
        failScreenView.style.display = 'inherit';
    }

    function win() {
        gameScreenView.style.display = 'none';
        winScreenView.style.display = 'inherit';
        failScreenView.style.display = 'none';
    }

    function play() {
        gameScreenView.style.display = 'inherit';
        winScreenView.style.display = 'none';
        failScreenView.style.display = 'none';
    }


    play();
    run();
    ansView.onchange = test;
}())
