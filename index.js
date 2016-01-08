// worksheets
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

// tab MVC
(function() {
    var tabGameCtrl = document.getElementById('tab-game');
    var tabGame = document.getElementsByClassName('game')[0];
    var tabWorksheetCtrl = document.getElementById('tab-worksheet');
    var tabWorksheet = document.getElementsByClassName('worksheet')[0];

    function showGame() {
        tabWorksheet.style.display = 'none';
        tabGame.style.display = 'inherit';
    }

    function showWorksheets() {
        tabWorksheet.style.display = 'inherit';
        tabGame.style.display = 'none';
    }

    tabGameCtrl.onclick = showGame;
    tabWorksheetCtrl.onclick = showWorksheets;

    showGame();
}());

// game MVC
(function() {
    var problemView = document.getElementById('game-problem');
    var ansView = document.getElementById('game-ans');
    var groupView = document.getElementById('game-group');
    var progressBar = document.getElementById('game-progress');
    var repeatBtn = document.getElementById('game-repeat');
    var problem = null;

    var screens = {
        game: document.getElementById('game-ui'),
        win: document.getElementById('game-win'),
        fail: document.getElementById('game-fail'),
        over: document.getElementById('game-over')
    };

    var invalid = ' has-error';
    var valid = ' has-success';
    var flashDuration = 1000;

    var lesson = {};


    function play() {
        showScreens(['game']);
        progressBar.style.width = '0';
        lesson = {
            done: 0,
            todo: 3,
            hearts: 3
        };
        run();
    }

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
            flashValidity('valid');
            lesson.done++;
            lesson.todo--;
            progressBar.style.width = 100 * lesson.done / (lesson.done + lesson.todo)+ '%';
            if (lesson.todo == 0)
                setTimeout(showScreens.bind(null, ['over', 'win']), flashDuration);
            else
                run();
        } else {
            flashValidity('invalid');
            lesson.hearts--;
            if (lesson.hearts < 0)
                showScreens(['over', 'fail']);
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


    function showScreens(keys) {
        for (var key in screens)
            screens[key].style.display = (keys.indexOf(key) == -1? 'none': 'inherit');
    }


    play();
    ansView.onchange = test;
    repeatBtn.onclick = play;
}())
