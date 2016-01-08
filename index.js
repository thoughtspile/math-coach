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
    var view = (function() {
        var invalid = ' has-error';
        var valid = ' has-success';
        var flashDuration = 1000;

        var dom = {
            screens: {
                game: document.getElementById('game-ui'),
                win: document.getElementById('game-win'),
                error: document.getElementById('game-error'),
                almost: document.getElementById('game-hint'),
                fail: document.getElementById('game-fail'),
                over: document.getElementById('game-over')
            },

            progressBar: document.getElementById('game-progress'),
            problem: document.getElementById('game-problem'),
            ans: document.getElementById('game-ans'),
            group: document.getElementById('game-group'),
            correctAns: document.getElementById('game-correct-ans'),

            repeatBtn: document.getElementById('game-repeat'),
            acceptBtn: document.getElementById('game-accept')
        };

        return {
            showScreens: function(keys) {
                for (var key in dom.screens) {
                    dom.screens[key].style.display = (keys.indexOf(key) == -1? 'none': 'inherit');
                }
            },
            flashValidity: function(state) {
                if (!state) {
                    dom.group.className = dom.group.className.replace(invalid, '').replace(valid, '');
                    return;
                }
                if (state == 'valid' && dom.group.className.indexOf(valid) == -1)
                    dom.group.className = dom.group.className.replace(invalid, '') + valid;
                else if (state == 'invalid' && dom.group.className.indexOf(invalid) == -1)
                    dom.group.className = dom.group.className.replace(valid, '') + invalid;
                window.setTimeout(view.flashValidity.bind(null, ''), flashDuration);
            },
            setProgress: function(percent) {
                dom.progressBar.style.width = percent + '%';
            },
            showProblem: function(problem) {
                setTimeout(function() { dom.ans.focus(); }, 0);
                view.showScreens(['game']);
                dom.ans.disabled = false;
                // katex.render(problem.problem.toString() + '=', problemView);
                dom.problem.innerHTML = problem.problem.toString() + ' =';
                dom.ans.value = '';
            },
            win: function() {
                setTimeout(view.showScreens.bind(null, ['over', 'win']), flashDuration);
                setTimeout(function() { dom.repeatBtn.focus(); }, flashDuration);
            },
            error: function(problem) {
                view.flashValidity('invalid');
                view.showScreens(['game', 'error']);
                dom.correctAns.innerHTML = problem.ans;
                dom.ans.disabled = true;
                dom.acceptBtn.focus();
            },
            getAns: function() {
                return parseFloat(dom.ans.value);
            },
            getDOM: function() {
                return dom;
            }
        }
    }());

    var model = (function() {
        var errPenalty = 5;
        var problem = null;
        var lesson = {};

        function mkProblem() {
            var rande = gen();
            return {problem: rande, ans: rande.value()};
        }

        return {
            reset: function() {
                lesson = {
                    done: 0,
                    todo: 3
                };
            },
            check: function(ans) {
                return ans == problem.ans;
            },
            next: function() {
                lesson.done++;
                lesson.todo--;
            },
            isOver: function() {
                return lesson.todo == 0;
            },
            penalize: function() {
                lesson.todo += errPenalty;
            },
            nextProblem: function() {
                problem = mkProblem();
                view.showProblem(problem);
                return problem;
            },
            progress: function() {
                return 100 * lesson.done / (lesson.done + lesson.todo);
            },
            getProblem: function() {
                return problem;
            }
        };
    }());

    var control = (function() {
        var dom = view.getDOM();

        function play() {
            model.reset();
            view.showScreens(['game']);
            view.setProgress(0);
            run();
        }

        function run() {
            var problem = model.nextProblem();
            console.log('The answer is ' + problem.ans);
        }

        function test() {
            if (model.check(view.getAns())) {
                view.flashValidity('valid');
                model.next();
                if (model.isOver()) {
                    view.win();
                } else {
                    run();
                }
            } else {
                model.penalize();
                view.error(model.getProblem());
            }
            view.setProgress(model.progress());
        }

        dom.ans.onchange = test;
        dom.repeatBtn.onclick = play;
        dom.acceptBtn.onclick = run;

        play();
    }());
}())
