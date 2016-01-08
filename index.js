// worksheets
(function() {
    var view = {
        dom: {
            depth: document.getElementById('depth'),
            mode: document.getElementById('mode'),
            runBtn: document.getElementById('run'),
            ans: document.getElementById('ans'),
            out: document.getElementById('res')
        },
        getDOM: function() {
            return this.dom;
        }
    };


    var model = {
        get: function(mode, showAns) {
            if (mode == 'expr') {
                var rande = gen();
                return rande + (showAns? ' | ' + rande.value(): '');
            } else if (mode == 'eqn') {
                var rande = gen.eqn();
                return rande.eqn + (showAns? ' | ' + rande.ans: '');
            }
        }
    };

    var run = function() {
        var dom = view.getDOM();
        gen.depth(dom.depth.value)
            .range([-200, 200]);
        var problems = [];
        for (var i = 0; i < 30; i++)
            problems.push(model.get(dom.mode.value, dom.ans.checked));
        view.getDOM().out.innerHTML = problems.join('\n');
    };

    view.getDOM().runBtn.onclick = run;
    view.getDOM().mode.onchange = run;
    view.getDOM().depth.onchange = run;
    view.getDOM().ans.onchange = run;
    run();
}());

// tab MVC
(function() {
    var view = {
        dom: {
            screens: {
                game: document.getElementsByClassName('game')[0],
                worksheet: document.getElementsByClassName('worksheet')[0]
            },
            gameLink: document.getElementById('tab-game'),
            worksheetLink: document.getElementById('tab-worksheet')
        },
        getDOM: function() {
            return this.dom;
        },
        screen: function(keys) {
            for (var key in this.dom.screens)
                this.dom.screens[key].style.display = (keys.indexOf(key) == -1? 'none': 'inherit');
        }
    };

    var control = (function() {
        var dom = view.getDOM();
        dom.gameLink.onclick = view.screen.bind(view, ['game']);
        dom.worksheetLink.onclick = view.screen.bind(view, ['worksheet']);
        view.screen(['game']);
    }());
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

        function check() {
            model.next();
            if (model.check(view.getAns())) {
                view.flashValidity('valid');
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

        var dom = view.getDOM();
        dom.ans.onchange = check;
        dom.repeatBtn.onclick = play;
        dom.acceptBtn.onclick = run;

        play();
    }());
}())
