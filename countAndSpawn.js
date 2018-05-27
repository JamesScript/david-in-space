function CountRegister() {
    this.currentLevel = 7; // 0 is menu
    this.sinceLastMeteorite = 0;
    this.nextMeteorite = Math.floor(Math.random() * 300) + 50;
    this.enemyWait = 0;
    this.levelFrame = 0;
    this.levelLengthsInReality = [2500, 3000, 2500, 3000];
    // this.levelLengthsInReality = [50, 50, 50, 3000];
    this.levelLengths = [];
    this.timeoutSet = false;
    this.toothAlienInterval = undefined;
    this.toothAlienIntervalSet = false;
    this.normalEnemyTimeoutSet = false;
    this.skullAlienTimeoutSet = false;
    this.meteoriteTimeoutSet = false;
    this.bossSpawned = false;
    this.gameOver = false;
    this.createLevelLengthsArray = () => {
        for (let i = 0; i < this.levelLengthsInReality.length; i++) {
            this.levelLengths.push(1);
            this.levelLengths.push(this.levelLengthsInReality[i]);
        }
        this.levelLengths.push(1);
    };
    this.go = () => {
        this.level[this.currentLevel]();
        if (this.currentLevel % 2 === 1) {
            this.levelFrame++;
        }
        if (this.levelFrame >= this.levelLengths[this.currentLevel]) {
            this.levelFrame = 0;
            this.currentLevel++;
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
            ctx.fillText("TOTAL SCORE: " + (p1.score + p1.totalSpent), width / 2, height * 0.6);
            if (!this.gameOver) {
                setTimeout(() => {
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
            if (!this.bossSpawned) {
                enemies.push(new Boss(width / 2, 0));
                this.bossSpawned = true;
            }
            if (enemies.length === 0) {
                this.interlude();
            }
        }
    };
    this.interlude = () => {
        if (enemies.length === 0 && shop.stage === 0) {
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
}