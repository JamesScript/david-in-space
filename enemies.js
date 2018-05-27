function Enemy(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.072;
    this.xVel = 5;
    this.yVel = 5;
    this.maxVel = 10;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.enemy, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        if (Math.abs(this.x - p1.x) < 20) {
            this.maxVel = mapNums(this.y, 0, height, 12, 2);
        }
        if (this.x > p1.x) {
            if (this.xVel > -this.maxVel) {
                this.xVel -= 1;
            }
        } else if (this.x < p1.x) {
            if (this.xVel < this.maxVel) {
                this.xVel += 1;
            }
        }
        this.y += this.yVel;
        this.x += this.xVel;
        for (let i = 0; i < bullets.length; i++) {
            if (collision(bullets[i], this)) {
                if (Math.random() > 0.8) {
                    items.push(new Item("bowler", this.x, this.y));
                }
                aud.clone(2);
                booms.push(new Boom(this.x, this.y));
                p1.score += 10;
                bullets[i].expended = true;
                this.expended = true;
            }
        }
        if (collision(this, p1)) {
            p1.damage(10);
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
    };
}

function GreenAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.24;
    this.h = height * 0.072;
    this.yVel = 1;
    this.stage = "enter";
    this.patrolFrame = 0;
    this.hp = 5;
    this.expended = false;
    this.dir = Math.round(Math.random());
    this.show = () => {
        ctx.drawImage(img.greenAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this[this.stage]();
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        let options = ["violin", "sax"];
                        items.push(new Item(options[this.dir], this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 50;
                    this.expended = true;
                }
            }
        }
        if (collision(this, p1)) {
            p1.damage(20);
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
        if (this.y > height + this.h) {
            this.expended = true;
        }
    };
    this.enter = () => {
        if (this.y < height * 0.2) {
            this.y += 10;
        } else {
            this.stage = "patrol";
        }
    };
    this.patrol = () => {
        if (this.patrolFrame < 40) {
            if (this.dir === 0) {
                this.x = Math.sin(this.patrolFrame) * width / 3 + width / 2;
                this.y = height * 0.2 + Math.sin(this.patrolFrame / 2) * height / 6;
            } else {
                this.x = -Math.sin(this.patrolFrame) * width / 3 + width / 2;
                this.y = height * 0.2 + (-Math.sin(this.patrolFrame / 2)) * height / 6;
            }
            this.patrolFrame+= 0.1;
        } else {
            this.stage = "charge";
        }
    };
    this.charge = () => {
        if (this.x > p1.x) {
            this.x -= (this.x - p1.x) / 5;
        } else if (this.x < p1.x) {
            this.x += (p1.x - this.x) / 5;
        }
        this.y += this.yVel;
        this.yVel++;
    };
}

function SkullAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.09;
    this.h = height * 0.072;
    this.yVel = height * 0.00723;
    this.hp = 3;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.skullAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y += this.yVel;
        this.yVel *= 0.95;
        if (this.yVel < height * 0.0014) this.yVel = height * 0.00723;
        this.expended = this.y > height + this.h;
        if (collision(this, p1)) {
            this.expended = true;
            p1.damage(15);
            booms.push(new Boom(this.x, this.y));
        }
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        items.push(new Item("bowler", this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 40;
                    this.expended = true;
                }
            }
        }
    };
}

function ToothAlien(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.146;
    this.h = height * 0.086;
    this.xVel = height * 0.0145;
    this.hp = 3;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.toothAlien, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y += 8;
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                this.hp--;
                aud.clone(2);
                bullets[i].expended = true;
                if (this.hp <= 0) {
                    if (Math.random() > 0.8) {
                        items.push(new Item("bowler", this.x, this.y));
                    }
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 50;
                    this.expended = true;
                }
            }
        }
        if (collision(this, p1)) {
            p1.damage(15);
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
        if (this.y > height + this.h) {
            this.expended = true;
        }
    };
}

function Meteorite(x, y, speed) {
    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.072;
    this.speed = speed;
    this.hp = 10;
    this.rot = 0;
    this.expended = false;
    this.show = () => {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(img.meteorite, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.rotate(-this.rot * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
    this.update = () => {
        this.y += this.speed;
        this.rot ++;
        this.expended = this.y > height + this.h;
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (collision(this, bullets[i])) {
                aud.clone(2);
                bullets[i].expended = true;
                this.hp--;
                if (this.hp <= 0) {
                    items.push(new Item("firstAid", this.x, this.y));
                    this.expended = true;
                    booms.push(new Boom(this.x, this.y));
                    p1.score += 80;
                }
            }
        }
        if (collision(this, p1)) {
            this.expended = true;
            booms.push(new Boom(this.x, this.y));
            p1.damage(30);
        }
    };
}

function Boss(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.36;
    this.h = height * 0.173;
    this.hp = 120;
    this.patrolFrame = 0;
    this.expended = false;
    this.stage = "enter";
    this.fireTimeoutSet = false;
    this.hitTimeoutSet = false;
    this.show = () => {
        ctx.drawImage(img.boss, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this[this.stage]();
        if (collision(this, p1) && !this.hitTimeoutSet) {
            p1.damage(20);
            setTimeout(() => {
                this.hitTimeoutSet = false;
            }, 1000);
            this.hitTimeoutSet = true;
        }
        for (let i = 0; i < bullets.length; i++) {
            if (collision(this, bullets[i])) {
                bullets[i].expended = true;
                aud.clone(2);
                this.hp--;
                if (this.hp <= 0) {
                    booms.push(new Boom(this.x, this.y));
                    this.expended = true;
                    for (let j = 0; j < 15; j++) {
                        let rndX = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
                        let rndY = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
                        setTimeout(() => {
                            booms.push(new Boom(this.x + rndX, this.y + rndY));
                        }, Math.floor(Math.random() * 1000));
                    }
                }
            }
        }
        if (!count.meteoriteTimeoutSet) {
            let rndSpawnTime = Math.floor(Math.random() * 1500) + 200;
            setTimeout(() => {
                enemies.push(new Meteorite(Math.floor(Math.random() * (width - 100)) + 50, 0, Math.floor(Math.random() * 7) + 5));
                count.meteoriteTimeoutSet = false;
            }, rndSpawnTime);
            count.meteoriteTimeoutSet = true;
        }
    };
    this.enter = () => {
        this.y += height * 0.01;
        if (this.y > height * 0.2) {
            this.stage = "firing";
        }
    };
    this.firing = () => {
        if (!this.fireTimeoutSet) {
            let rndTime = Math.floor(Math.random() * 400) + 200;
            let rndPos = Math.floor(Math.random() * 100) - 50;
            setTimeout(() => {
                enemies.push(new BossSpawn(this.x + rndPos, this.y));
                this.fireTimeoutSet = false;
            }, rndTime);
            this.fireTimeoutSet = true;
        }
        if (this.patrolFrame < 40) {
            this.x = Math.sin(this.patrolFrame) * width / 3 + width / 2;
            this.y = height * 0.2 + Math.sin(this.patrolFrame / 2) * height / 6;
            this.patrolFrame+= 0.1;
        } else {
            this.patrolFrame = 0;
            this.stage = "rise";
        }
    };
    this.rise = () => {
        this.y -= height * 0.01;
        if (this.y < -0.1 * height) {
            this.x = Math.floor(Math.random() * (width * 0.9) + width * 0.05);
            this.stage = "charge";
        }
    };
    this.charge = () => {
        this.y += height * 0.02;
        if (this.y > height * 1.05) {
            this.y = -0.1 * height;
            this.x = width / 2;
            this.stage = "enter";
        }
    };
}

function BossSpawn(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.073;
    this.h = height * 0.072;
    this.expended = false;
    this.show = () => {
        ctx.drawImage(img.bossSpawn, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y += height * 0.0072;
        if (this.y > height) {
            this.expended = true;
        }
        for (let i = 0; i < bullets.length; i++) {
            if (collision(bullets[i], this)) {
                if (Math.random() > 0.8) {
                    items.push(new Item("bowler", this.x, this.y));
                }
                aud.clone(2);
                booms.push(new Boom(this.x, this.y));
                p1.score += 10;
                bullets[i].expended = true;
                this.expended = true;
            }
        }
        if (collision(this, p1)) {
            p1.damage(10);
            booms.push(new Boom(this.x, this.y));
            this.expended = true;
        }
    };

}