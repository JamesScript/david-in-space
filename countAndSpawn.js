function CountRegister() {
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
    this.finalMessages = [
        "Congratulations!!",
        "You have saved our solar system from the alien predators.",
        "All residents of Earth, Mars and Io cannot express ",
        "the full extent of their gratitude.",
        "It is now time to invade the home planet of the predators.",
        "Defeat as many foes as you can to get the highest score you can.",
        "This will be your last chance to stock up on supplies from the shop.",
        "After this there is no turning back. We are eternally grateful for",
        "your noble sacrifice. -- the human race"
    ];
    this.messageSlice = this.finalMessages.slice();
    this.messageTimeoutSet = false;
    this.bonusLevelSpawnFrequency = 1500;
    this.createLevelLengthsArray = () => {
        for (let i = 0; i < this.levelLengthsInReality.length; i++) {
            this.levelLengths.push(1);
            this.levelLengths.push(this.levelLengthsInReality[i]);
        }
        this.levelLengths.push(1);
    };
    this.go = () => {
        this.level[this.currentLevel]();
        if (this.currentLevel % 2 === 1 && [9, 19, 21].indexOf(this.currentLevel) === -1) {
            this.levelFrame++;
        }
        if (this.levelFrame >= this.levelLengths[this.currentLevel]) {
            this.levelFrame = 0;
            this.currentLevel++;
            shop.restock();
        }
    };
    this.level = {
        99: () => {
            if (this.toothAlienIntervalSet) {
                clearInterval(this.toothAlienInterval);
                this.toothAlienIntervalSet = false;
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign="center";
            ctx.fillText("GAME OVER", width / 2, height / 2);
            let totalScore = p1.score + p1.totalSpent;
            ctx.fillText("TOTAL SCORE: " + totalScore, width / 2, height * 0.6);
            if (!this.gameOver) {
                setTimeout(() => {
                    if (totalScore > personalBest) {
                        setCookie("dcdjScore", totalScore.toString(), 365);
                        personalBest = totalScore;
                    }
                    if (isMobile) mouse.x = mouse.y = 0;
                    this.currentLevel = 0;
                    p1 = new Player();
                    enemies = [];
                    this.gameOver = false;
                }, 3000);
                this.gameOver = true;
            }
        },
        1: () => {
            if (Math.random() > 0.99) {
                enemies.push(new Enemy(Math.random() * width, 0));
                this.enemyWait = 0;
            } else {
                this.enemyWait++;
                if (this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    this.enemyWait = 0;
                }
            }
            if (this.sinceLastMeteorite >= this.nextMeteorite) {
                enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 5) + 5));
                this.sinceLastMeteorite = 0;
                this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
            } else {
                this.sinceLastMeteorite++;
            }
        },
        2: () => {
            this.interlude();
        },
        3: () => {
            if (Math.random() > 0.995) {
                enemies.push(new Enemy(Math.random() * width, 0));
                this.enemyWait = 0;
            } else {
                this.enemyWait++;
                if (this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    this.enemyWait = 0;
                }
            }
            if (Math.random() > 0.99) {
                enemies.push(new SkullAlien(Math.random() * (width - 100) + 50, 0));
            }
            if (this.sinceLastMeteorite >= this.nextMeteorite) {
                enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 5) + 5));
                this.sinceLastMeteorite = 0;
                this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
            } else {
                this.sinceLastMeteorite++;
            }
        },
        4: () => {
            this.interlude();
        },
        5: () => {
            if (!this.toothAlienIntervalSet) {
                let xGap = width / 6;
                this.toothAlienInterval = setInterval(() => {
                    for (let i = 0; i < 5; i++) {
                        let initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i+1), initialHeight));
                    }
                }, 5000);
                this.toothAlienIntervalSet = true;
            }
            if (!this.normalEnemyTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    let rnd = Math.ceil(Math.random() * 6);
                    let xGap = width / rnd;
                    for (let i = 0; i < rnd; i++) {
                        enemies.push(new Enemy(xGap * (i+1), 0 - Math.random() * 100));
                    }
                    this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                this.normalEnemyTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
        },
        6: () => {
            if (this.toothAlienIntervalSet) {
                clearInterval(this.toothAlienInterval);
                this.toothAlienIntervalSet = false;
            }
            this.interlude();
        },
        7: () => {
            if (!this.skullAlienTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 300) + 200;
                setTimeout(() => {
                    enemies.push(new SkullAlien(Math.floor(Math.random() * (width - 100)) + 50, 0));
                    this.skullAlienTimeoutSet = false;
                }, rndSpawnTime);
                this.skullAlienTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
            if (!this.toothAlienIntervalSet) {
                let xGap = width / 6;
                this.toothAlienInterval = setInterval(() => {
                    for (let i = 0; i < 5; i++) {
                        let initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i+1), initialHeight));
                    }
                }, 5000);
                this.toothAlienIntervalSet = true;
            }
        },
        8: () => {
            if (this.toothAlienIntervalSet) {
                clearInterval(this.toothAlienInterval);
                this.toothAlienIntervalSet = false;
            }
            this.interlude();
        },
        9: () => {
            if (!this.bossSpawned) {
                enemies.push(new Boss(width / 2, 0));
                this.bossSpawned = true;
            }
            if (!this.meteoriteTimeoutSet && !this.bossKilled) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
            if (enemies.length === 0) {
                this.currentLevel = 10;
                this.bossSpawned = this.bossKilled = false;
            }
        },
        10: () => {
            this.interlude();
        },
        11: () => {
            if (Math.random() > 0.98) {
                enemies.push(new EyeballAlien(Math.random() * width, 0));
                this.enemyWait = 0;
            } else {
                this.enemyWait++;
                if (this.enemyWait >= 100) {
                    enemies.push(new GreenAlien(width / 2, 0));
                    this.enemyWait = 0;
                }
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
        },
        12: () => {
            this.interlude();
        },
        13: () => {
            if (!this.normalEnemyTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 600) + 20;
                let enemyChoices = [Enemy, SkullAlien, EyeballAlien];
                setTimeout(() => {
                    enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](Math.floor(Math.random() * (width - 100)) + 50, 0));
                    this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                this.normalEnemyTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
        },
        14: () => {
            this.interlude();
        },
        15: () => {
            if (!this.normalEnemyTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 300;
                let enemyChoices = [Enemy, SkullAlien, EyeballAlien, TongueAlien];
                setTimeout(() => {
                    let rnd = Math.ceil(Math.random() * 6);
                    let xGap = width / (rnd + 1);
                    for (let i = 0; i < rnd; i++) {
                        enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](xGap * (i+1), 0 - Math.random() * 100));
                    }
                    this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                this.normalEnemyTimeoutSet = true;
                this.normalEnemyTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
            if (!this.toothAlienIntervalSet) {
                let xGap = width / 6;
                this.toothAlienInterval = setInterval(() => {
                    for (let i = 0; i < 5; i++) {
                        let initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i+1), initialHeight));
                    }
                }, 5000);
                this.toothAlienIntervalSet = true;
            }
        },
        16: () => {
            if (this.toothAlienIntervalSet) {
                clearInterval(this.toothAlienInterval);
                this.toothAlienIntervalSet = false;
            }
            this.interlude();
        },
        17: () => {
            if (!this.normalEnemyTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1200) + 500;
                let enemyChoices = [Enemy, SkullAlien, EyeballAlien, ToothAlien, TongueAlien];
                setTimeout(() => {
                    enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](Math.floor(Math.random() * (width - 100)) + 50, 0));
                    this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                this.normalEnemyTimeoutSet = true;
            }
            if (!this.bacteriophageTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Bacteriophage(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 3) + 3));
                    this.bacteriophageTimeoutSet = false;
                }, rndSpawnTime);
                this.bacteriophageTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
        },
        18: () => {
            this.interlude();
        },
        19: () => {
            if (!this.bossSpawned) {
                enemies.push(new Boss(width / 2, 0));
                this.bossSpawned = true;
            }
            if (!this.meteoriteTimeoutSet && !this.bossKilled) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
            if (enemies.length === 0) {
                for (let i = 0; i < 50; i++) {
                    shop.restock();
                }
                this.currentLevel = 20;
                this.bossSpawned = this.bossKilled = false;
                if (this.messageSlice.length === 0) this.messageSlice = this.finalMessages.slice();
            }
        },
        20: () => {
            if (this.bonusLevelSpawnFrequency < 1500) this.bonusLevelSpawnFrequency = 1500;
            if (this.messageSlice.length > 0) {
                for (let i = 0; i < stars.length; i++) {
                    stars[i].speed *= 0.98;
                }
            }
            this.gameComplete();
        },
        21: () => {
            if (!this.normalEnemyTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * this.bonusLevelSpawnFrequency) + 200;
                let enemyChoices = [Enemy, GreenAlien, SkullAlien, EyeballAlien, ToothAlien, TongueAlien];
                setTimeout(() => {
                    let rnd = Math.ceil(Math.random() * 6);
                    let xGap = width / (rnd + 1);
                    for (let i = 0; i < rnd; i++) {
                        enemies.push(new enemyChoices[Math.floor(Math.random() * enemyChoices.length)](xGap * (i+1), 0 - Math.random() * 100));
                    }
                    if (this.bonusLevelSpawnFrequency > 20) this.bonusLevelSpawnFrequency -= 20;
                    this.normalEnemyTimeoutSet = false;
                }, rndSpawnTime);
                this.normalEnemyTimeoutSet = true;
            }
            if (!this.bacteriophageTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Bacteriophage(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 3) + 3));
                    this.bacteriophageTimeoutSet = false;
                }, rndSpawnTime);
                this.bacteriophageTimeoutSet = true;
            }
            if (!this.meteoriteTimeoutSet) {
                let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
                setTimeout(() => {
                    enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                    this.meteoriteTimeoutSet = false;
                }, rndSpawnTime);
                this.meteoriteTimeoutSet = true;
            }
            if (!this.toothAlienIntervalSet) {
                let xGap = width / 6;
                this.toothAlienInterval = setInterval(() => {
                    for (let i = 0; i < 5; i++) {
                        let initialHeight = i % 2 === 0 ? 0 : -100;
                        enemies.push(new ToothAlien(xGap * (i+1), initialHeight));
                    }
                }, 5000);
                this.toothAlienIntervalSet = true;
            }
        }
    };
    this.interlude = () => {
        if (
            enemies.length === 0
            && shop.stage === 0
            && this.toothAlienIntervalSet === false
            && this.normalEnemyTimeoutSet === false
            && this.skullAlienTimeoutSet === false
            && this.meteoriteTimeoutSet === false
            && this.bacteriophageTimeoutSet === false
        ) {
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign="center";
            let lvl = this.currentLevel / 2;
            ctx.fillText(`LEVEL ${lvl} COMPLETE!!!`, width / 2, height / 2);
            if (!this.timeoutSet) {
                setTimeout(() => {
                    shop.stage = 1;
                    this.timeoutSet = false;
                }, 2500);
                this.timeoutSet = true;
            }
        }
    };
    this.gameComplete = () => {
        if (!this.messageTimeoutSet) {
            setTimeout(() => {
                this.messageSlice.shift();
                this.messageTimeoutSet = false;
            }, 3500);
            this.messageTimeoutSet = true;
        }
        if (this.messageSlice.length > 0) {
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.3;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign="center";
            let message = this.messageSlice[0];
            let arr = message.split(" ");
            let lines = [];
            let toConcat = "";
            while (arr.length > 0) {
                toConcat = toConcat.concat(arr[0] + " ");
                console.log(toConcat);
                arr.shift();
                if (toConcat.length >= 20 || arr.length === 0) {
                    lines.push(toConcat);
                    toConcat = "";
                }
            }
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], width / 2, height / 2 + i * (height * 0.03));
            }
        } else {
            this.interlude();
        }
    }
}