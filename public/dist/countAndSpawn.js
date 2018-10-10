"use strict";

function CountRegister() {
    var _this = this;

    this.currentLevel = 0; // 0 is menu
    this.sinceLastMeteorite = 0;
    this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
    this.enemyWait = 0;
    this.levelFrame = 0;
    this.levelLengthsInReality = [2500, 3000, 2500, 3000, 8055, 2500, 2500, 3000, 2500, 8055];
    this.levelLengths = [];
    this.timeoutSet = false;
    this.toothAlienInterval = undefined;
    this.toothAlienIntervalSet = false;
    this.normalEnemyTimeoutSet = false;
    this.skullAlienTimeoutSet = false;
    this.meteoriteTimeoutSet = false;
    this.bacteriophageTimeoutSet = false;
    this.bossSpawned = false;
    this.bossKilled = false;
    this.gameOver = false;
    this.finalMessages = ["Congratulations!!", "You have saved our solar system from the alien predators.", "All residents of Earth, Mars and Io cannot express ", "the full extent of their gratitude.", "It is now time to invade the home planet of the predators.", "Defeat as many foes as you can to get the highest score you can.", "This will be your last chance to stock up on supplies from the shop.", "After this there is no turning back. We are eternally grateful for", "your noble sacrifice. -- the human race"];
    this.messageSlice = this.finalMessages.slice();
    this.messageTimeoutSet = false;
    this.bonusLevelSpawnFrequency = 1500;
    // this.apiScores = [];
    this.hiscorePage = {
        scoreList: [],
        titleHeight: height * 0.6,
        posted: false,
        alias: "",
        currentlyUpdating: false,
        reqSent: false,
        resRecieved: false
    };
    this.postHiscore = function() {
        _this.hiscorePage.currentlyUpdating = true;
        var totalScore = p1.score + p1.totalSpent;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            _this.hiscorePage.scoreList = response.scores;
            _this.currentLevel = 101;
            _this.hiscorePage.posted = false;
            _this.hiscorePage.currentlyUpdating = false;
            inputBox.style.display = "none";
            // console.log(_this.hiscorePage.scoreList);
          }
        };
        xhttp.open("POST", "/api/postscore", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var message = "score=" + totalScore + "&name=" + _this.hiscorePage.alias + "&david=" + (p1.isCross ? "cross" : "jackson");
        xhttp.send(message);
    };
    this.createLevelLengthsArray = function () {
        for (var i = 0; i < _this.levelLengthsInReality.length; i++) {
            _this.levelLengths.push(1);
            _this.levelLengths.push(_this.levelLengthsInReality[i]);
        }
        _this.levelLengths.push(1);
    };
    this.go = function () {
        _this.level[_this.currentLevel]();
        if (_this.currentLevel % 2 === 1 && [9, 19, 21].indexOf(_this.currentLevel) === -1) {
            _this.levelFrame++;
        }
        if (_this.levelFrame >= _this.levelLengths[_this.currentLevel]) {
            _this.levelFrame = 0;
            _this.currentLevel++;
            shop.restock();
        }
    };
    this.level = {
        99: function _() {
          //GAME OVER
            if (_this.toothAlienIntervalSet) {
                clearInterval(_this.toothAlienInterval);
                _this.toothAlienIntervalSet = false;
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", width / 2, height / 2);
            var totalScore = p1.score + p1.totalSpent;
            ctx.fillText("TOTAL SCORE: " + totalScore, width / 2, height * 0.6);
            if (!_this.hiscorePage.reqSent) {
                
            }
            if (!_this.gameOver) {
                setTimeout(function () {
                    if (totalScore > personalBest) {
                        setCookie("dcdjScore", totalScore.toString(), 365);
                        personalBest = totalScore;
                    }
                    if (isMobile) mouse.x = mouse.y = 0;
                    if (totalScore >= Number(count.hiscorePage.scoreList[9].score)) {
                      _this.currentLevel = 100;
                    } else {
                      _this.currentLevel = 101;
                    }
                    enemies = [];
                    _this.gameOver = false;
                }, 3000);
                _this.gameOver = true;
            }
        },
      // POST SCORE
        100: function _() {
          ctx.fillStyle="#000000";
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.font = font(18);
          var totalScore = p1.score + p1.totalSpent;
          ctx.fillText("TOTAL SCORE: " + totalScore, width / 2, _this.hiscorePage.titleHeight);
          
          // The hiscore body
          if (_this.hiscorePage.titleHeight > height * 0.1) {
            _this.hiscorePage.titleHeight -= height * 0.01;
          } else {
            // This if-else just waits for the text to glide to the top of the screen before moving on
            if (isMobile || true) {
              inputBox.style.display = "block";
            } else {
              ctx.fillText(_this.hiscorePage.alias + "_", width / 2, height * 0.3);
            }
            ctx.fillText("Please spell your alias", width / 2, height * 0.2);
            ctx.fillText("to upload your hiscore", width / 2, height * 0.25);
            var submitBtn = {
              x: width / 2, 
              y: height * 0.75,
              w: width * 0.4,
              h: height * 0.1
            }
            ctx.fillStyle="#555555";
            ctx.fillRect(submitBtn.x - submitBtn.w / 2, submitBtn.y - submitBtn.h / 2, submitBtn.w, submitBtn.h);
            ctx.fillStyle="#FFFFFF";
            ctx.fillText("SUBMIT", width / 2, height * 0.75);
            if (collision(submitBtn, mouse)) {
              cursor("pointer");
              if (mouse.down && !_this.hiscorePage.posted) {
                _this.postHiscore();
                _this.hiscorePage.posted = true;
              }
            }
          }
        },
      // SCORE LIST
        101: function _() {
          ctx.fillStyle="#000000";
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.font = font(18);
          ctx.fillText("HISCORES", width * 0.5, height * 0.15);
          for (let i = 0; i < _this.hiscorePage.scoreList.length; i++) {
            var rowH = height * 0.05 * (i+1) + height * 0.2;
            ctx.fillText(_this.hiscorePage.scoreList[i].name, width * 0.3, rowH);
            ctx.fillText(_this.hiscorePage.scoreList[i].score, width * 0.7, rowH);
            ctx.drawImage(_this.hiscorePage.scoreList[i].david === "cross" ? img.dc : img.dj, width * 0.47, rowH - height * 0.03, width * 0.06, height * 0.04);
          }
        },
        1: function _() {
            if (Math.random() > 0.99) {
                enemies.push(new Enemy(Math.random() * width, 0));
                _this.enemyWait = 0;
            } else {
                _this.enemyWait++;
                if (_this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    _this.enemyWait = 0;
                }
            }
            if (_this.sinceLastMeteorite >= _this.nextMeteorite) {
                enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 5) + 5));
                _this.sinceLastMeteorite = 0;
                _this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
            } else {
                _this.sinceLastMeteorite++;
            }
        },
        2: function _() {
            _this.interlude();
        },
        3: function _() {
            if (Math.random() > 0.995) {
                enemies.push(new Enemy(Math.random() * width, 0));
                _this.enemyWait = 0;
            } else {
                _this.enemyWait++;
                if (_this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    _this.enemyWait = 0;
                }
            }
            if (Math.random() > 0.99) {
                enemies.push(new SkullAlien(Math.random() * (width - 100) + 50, 0));
            }
            if (_this.sinceLastMeteorite >= _this.nextMeteorite) {
                enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 5) + 5));
                _this.sinceLastMeteorite = 0;
                _this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
            } else {
                _this.sinceLastMeteorite++;
            }
        },
        4: function _() {
            _this.interlude();
        },
        5: function _() {
            if (!_this.toothAlienIntervalSet) {
                var xGap = width / 6;
                _this.toothAlienInterval = setInterval(function () {
                    for (var i = 0; i < 5; i++) {
                        var initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i + 1), initialHeight));
                    }
                }, 5000);
                _this.toothAlienIntervalSet = true;
            }
            if (!_this.normalEnemyTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    var rnd = Math.ceil(Math.random() * 6);
                    var xGap = width / rnd;
                    for (var i = 0; i < rnd; i++) {
                        enemies.push(new Enemy(xGap * (i + 1), 0 - Math.random() * 100));
                    }
                    _this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                _this.normalEnemyTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime);
                _this.meteoriteTimeoutSet = true;
            }
        },
        6: function _() {
            if (_this.toothAlienIntervalSet) {
                clearInterval(_this.toothAlienInterval);
                _this.toothAlienIntervalSet = false;
            }
            _this.interlude();
        },
        7: function _() {
            if (!_this.skullAlienTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 300) + 200;
                setTimeout(function () {
                    enemies.push(new SkullAlien(Math.floor(Math.random() * (width - 100)) + 50, 0));
                    _this.skullAlienTimeoutSet = false;
                }, rndSpawnTime);
                _this.skullAlienTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime2 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime2);
                _this.meteoriteTimeoutSet = true;
            }
            if (!_this.toothAlienIntervalSet) {
                var xGap = width / 6;
                _this.toothAlienInterval = setInterval(function () {
                    for (var i = 0; i < 5; i++) {
                        var initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i + 1), initialHeight));
                    }
                }, 5000);
                _this.toothAlienIntervalSet = true;
            }
        },
        8: function _() {
            if (_this.toothAlienIntervalSet) {
                clearInterval(_this.toothAlienInterval);
                _this.toothAlienIntervalSet = false;
            }
            _this.interlude();
        },
        9: function _() {
            if (!_this.bossSpawned) {
                enemies.push(new Boss(width / 2, 0));
                _this.bossSpawned = true;
            }
            if (!_this.meteoriteTimeoutSet && !_this.bossKilled) {
                var rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                _this.meteoriteTimeoutSet = true;
            }
            if (enemies.length === 0) {
                _this.currentLevel = 10;
                _this.bossSpawned = _this.bossKilled = false;
            }
        },
        10: function _() {
            _this.interlude();
        },
        11: function _() {
            if (Math.random() > 0.98) {
                enemies.push(new EyeballAlien(Math.random() * width, 0));
                _this.enemyWait = 0;
            } else {
                _this.enemyWait++;
                if (_this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    _this.enemyWait = 0;
                }
            }
            if (!_this.meteoriteTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                _this.meteoriteTimeoutSet = true;
            }
        },
        12: function _() {
            _this.interlude();
        },
        13: function _() {
            if (!_this.normalEnemyTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 600) + 20;
                var enemyChoices = [Enemy, SkullAlien, EyeballAlien];
                setTimeout(function () {
                    enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](Math.floor(Math.random() * (width - 100)) + 50, 0));
                    _this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                _this.normalEnemyTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime3 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime3);
                _this.meteoriteTimeoutSet = true;
            }
        },
        14: function _() {
            _this.interlude();
        },
        15: function _() {
            if (!_this.normalEnemyTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 1500) + 300;
                var enemyChoices = [Enemy, SkullAlien, EyeballAlien, TongueAlien];
                setTimeout(function () {
                    var rnd = Math.ceil(Math.random() * 6);
                    var xGap = width / (rnd + 1);
                    for (var i = 0; i < rnd; i++) {
                        enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](xGap * (i + 1), 0 - Math.random() * 100));
                    }
                    _this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                _this.normalEnemyTimeoutSet = true;
                _this.normalEnemyTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime4 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime4);
                _this.meteoriteTimeoutSet = true;
            }
            if (!_this.toothAlienIntervalSet) {
                var xGap = width / 6;
                _this.toothAlienInterval = setInterval(function () {
                    for (var i = 0; i < 5; i++) {
                        var initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i + 1), initialHeight));
                    }
                }, 5000);
                _this.toothAlienIntervalSet = true;
            }
        },
        16: function _() {
            if (_this.toothAlienIntervalSet) {
                clearInterval(_this.toothAlienInterval);
                _this.toothAlienIntervalSet = false;
            }
            _this.interlude();
        },
        17: function _() {
            if (!_this.normalEnemyTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * 1200) + 500;
                var enemyChoices = [Enemy, SkullAlien, EyeballAlien, ToothAlien, TongueAlien];
                setTimeout(function () {
                    enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](Math.floor(Math.random() * (width - 100)) + 50, 0));
                    _this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                _this.normalEnemyTimeoutSet = true;
            }
            if (!_this.bacteriophageTimeoutSet) {
                var _rndSpawnTime5 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Bacteriophage(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 3) + 3));
                    _this.bacteriophageTimeoutSet = false;
                }, _rndSpawnTime5);
                _this.bacteriophageTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime6 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime6);
                _this.meteoriteTimeoutSet = true;
            }
        },
        18: function _() {
            _this.interlude();
        },
        19: function _() {
            if (!_this.bossSpawned) {
                enemies.push(new Boss(width / 2, 0));
                _this.bossSpawned = true;
            }
            if (!_this.meteoriteTimeoutSet && !_this.bossKilled) {
                var rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                _this.meteoriteTimeoutSet = true;
            }
            if (enemies.length === 0) {
                for (var i = 0; i < 50; i++) {
                    shop.restock();
                }
                _this.currentLevel = 20;
                _this.bossSpawned = _this.bossKilled = false;
                if (_this.messageSlice.length === 0) _this.messageSlice = _this.finalMessages.slice();
            }
        },
        20: function _() {
            if (_this.bonusLevelSpawnFrequency < 1500) _this.bonusLevelSpawnFrequency = 1500;
            if (_this.messageSlice.length > 0) {
                for (var i = 0; i < stars.length; i++) {
                    stars[i].speed *= 0.98;
                }
            }
            _this.gameComplete();
        },
        21: function _() {
            if (!_this.normalEnemyTimeoutSet) {
                var rndSpawnTime = Math.floor(Math.random() * _this.bonusLevelSpawnFrequency) + 200;
                var enemyChoices = [Enemy, GreenAlien, SkullAlien, EyeballAlien, ToothAlien, TongueAlien];
                setTimeout(function () {
                    var rnd = Math.ceil(Math.random() * 6);
                    var xGap = width / (rnd + 1);
                    for (var i = 0; i < rnd; i++) {
                        enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](xGap * (i + 1), 0 - Math.random() * 100));
                    }
                    if (_this.bonusLevelSpawnFrequency > 20) _this.bonusLevelSpawnFrequency -= 20;
                    _this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                _this.normalEnemyTimeoutSet = true;
            }
            if (!_this.bacteriophageTimeoutSet) {
                var _rndSpawnTime7 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Bacteriophage(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 3) + 3));
                    _this.bacteriophageTimeoutSet = false;
                }, _rndSpawnTime7);
                _this.bacteriophageTimeoutSet = true;
            }
            if (!_this.meteoriteTimeoutSet) {
                var _rndSpawnTime8 = Math.floor(Math.random() * 1500) + 200;
                setTimeout(function () {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    _this.meteoriteTimeoutSet = false;
                }, _rndSpawnTime8);
                _this.meteoriteTimeoutSet = true;
            }
            if (!_this.toothAlienIntervalSet) {
                var xGap = width / 6;
                _this.toothAlienInterval = setInterval(function () {
                    for (var i = 0; i < 5; i++) {
                        var initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i + 1), initialHeight));
                    }
                }, 5000);
                _this.toothAlienIntervalSet = true;
            }
        }
    };
    this.interlude = function () {
        if (enemies.length === 0 && shop.stage === 0 && _this.toothAlienIntervalSet === false && _this.normalEnemyTimeoutSet === false && _this.skullAlienTimeoutSet === false && _this.meteoriteTimeoutSet === false && _this.bacteriophageTimeoutSet === false) {
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            var lvl = _this.currentLevel / 2;
            ctx.fillText("LEVEL " + lvl + " COMPLETE!!!", width / 2, height / 2);
            if (!_this.timeoutSet) {
                setTimeout(function () {
                    shop.stage = 1;
                    _this.timeoutSet = false;
                }, 2500);
                _this.timeoutSet = true;
            }
        }
    };
    this.gameComplete = function () {
        if (!_this.messageTimeoutSet) {
            setTimeout(function () {
                _this.messageSlice.shift();
                _this.messageTimeoutSet = false;
            }, 3500);
            _this.messageTimeoutSet = true;
        }
        if (_this.messageSlice.length > 0) {
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.3;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            var message = _this.messageSlice[0];
            var arr = message.split(" ");
            var lines = [];
            var toConcat = "";
            while (arr.length > 0) {
                toConcat = toConcat.concat(arr[0] + " ");
                console.log(toConcat);
                arr.shift();
                if (toConcat.length >= 20 || arr.length === 0) {
                    lines.push(toConcat);
                    toConcat = "";
                }
            }
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], width / 2, height / 2 + i * (height * 0.03));
            }
        } else {
            _this.interlude();
        }
    };
}
//# sourceMappingURL=countAndSpawn.js.map