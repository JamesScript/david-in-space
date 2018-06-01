function Player() {
    this.x = 300;
    this.y = 800;
    this.w = width * 0.12;
    this.h = height * 0.065;
    this.hp = 100;
    this.barrier = 1;
    this.maxHp = 100;
    this.equip = 0;
    this.canShoot = true;
    this.speed = width * 0.0486;
    this.xTarget = 300;
    this.yTarget = 300;
    this.score = 0;
    this.totalSpent = 0; // used to calculate total score
    this.dead = false;
    this.isCross = false;
    this.uziAmmo = 200;
    this.rocketAmmo = 5;
    this.rocketDamage = 30;
    this.show = () => {
        if (this.hp > 0) {
            let sprite = this.isCross ? img.dc : img.dj;
            ctx.drawImage(sprite, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        } else {
            this.death();
        }
    };
    this.update = () => {
        if (mouse.x > this.w / 2 && mouse.x < width - this.w / 2) {
            this.xTarget = mouse.x;
        }
        if (this.x > this.xTarget) {
            if (this.x - this.xTarget < this.speed) {
                this.x -= this.x - this.xTarget;
            } else {
                this.x -= this.speed;
            }
        } else if (this.x < this.xTarget) {
            if (this.xTarget - this.x < this.speed) {
                this.x += this.xTarget - this.x;
            } else {
                this.x += this.speed;
            }
        }
        if (mouse.y > this.h / 2 && mouse.y < height - this.h / 2) {
            this.yTarget = mouse.y;
        }
        if (this.y > this.yTarget) {
            if (this.y - this.yTarget < this.speed) {
                this.y -= this.y - this.yTarget;
            } else {
                this.y -= this.speed;
            }
        } else if (this.y < this.yTarget) {
            if (this.yTarget - this.y < this.speed) {
                this.y += this.yTarget - this.y;
            } else {
                this.y += this.speed;
            }
        }
        if (mouse.down && this.equip === 1 && this.canShoot) {
            this.shoot();
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, 60);
        }
        if (this.barrier > 0) {
            ctx.strokeStyle = "#0000FF";
            ctx.lineWidth = Math.sin(count.levelFrame / 10) * 3 + 4;
            for (let i = 0; i < this.barrier; i++) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, width * 0.07 + (i+1) * width * 0.01, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
        this.contain();
    };
    this.shoot = () => {
        if (
            shop.stage !== 2
            && !paused
            && count.currentLevel > 0
            && p1.hp > 0
            && mouse.x > 0
            && mouse.x < width && mouse.y > 0
            && mouse.y < height * 0.9
        ) {
            if (this.equip === 2) {
                if (this.rocketAmmo > 0) {
                    aud.clone(0); // change to rocket sound
                    bullets.push(new Rocket(this.x));
                    this.rocketAmmo--;
                } else {
                    this.equip = 0;
                }
            } else {
                aud.clone(0);
                bullets.push(new Bullet(this.x));
                if (this.equip === 1 && this.uziAmmo > 0) {
                    this.uziAmmo--;
                }
                if (this.uziAmmo <= 0) {
                    this.equip = 0;
                }
            }
        }
    };
    this.contain = () => {
        if (this.x < 0) this.x = 0;
        if (this.x > width) this.x = width;
        if (this.y < 0) this.y = 0;
        if (this.y > height) this.y = height;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
    };
    this.damage = (amount) => {
        if (this.barrier <= 0) {
            this.hp -= amount;
        } else {
            this.barrier--;
        }
    };
    this.death = () => {
        if (!this.dead) {
            count.currentLevel = 99;
            booms.push(new Boom(this.x, this.y));
            this.dead = true;
        }
    };
}

function Bullet(x) {
    this.x = x;
    this.y = p1.y;
    this.w = width * 0.0121;
    this.h = height * 0.0217;
    this.isRocket = false;
    this.speed = height * 0.0145;
    this.expended = false;
    this.show = () => {
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y -= this.speed;
        if (this.y < -this.h) {
            this.expended = true;
        }
    };
}

function Rocket(x) {
    this.x = x;
    this.y = p1.y;
    this.w = width * 0.0221;
    this.h = height * 0.0317;
    this.isRocket = true;
    this.speed = height * 0.0115;
    this.expended = false;
    this.show = () => {
        ctx.fillStyle = "#AA00FF";
        ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };
    this.update = () => {
        this.y -= this.speed;
        if (this.y < -this.h) {
            this.expended = true;
        }
    };
}

function shrapnel(x, y) {
    const destinationChoices = [
        {x: 0, y: height * 0.12},
        {x: width * 0.04, y: height * 0.08},
        {x: width * 0.08, y: height * 0.04},
        {x: width * 0.12, y: 0},
        {x: width * 0.08, y: height * -0.04},
        {x: width * 0.04, y: height * -0.08},
        {x: 0, y: height * -0.12},
        {x: width * -0.04, y: height * -0.08},
        {x: width * -0.08, y: height * -0.04},
        {x: width * -0.12, y: 0},
        {x: width * -0.08, y: height * 0.04},
        {x: width * -0.04, y: height * 0.08}
    ];
    setTimeout(() => {
        for (let i = 0; i < 12; i++) {
            bullets.push(new ShrapnelPiece(x, y, destinationChoices[i].x, destinationChoices[i].y));
        }
    }, 10);
}

function ShrapnelPiece(x, y, xVel, yVel) {
    this.x = x;
    this.y = y;
    this.w = width * 0.012;
    this.h = width * 0.012;
    this.expended = false;
    this.isRocket = false;
    this.isShrapnel = true;
    this.destination = {x: xVel, y: yVel};
    this.show = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 2 * Math.PI, false);
        ctx.fillStyle = "#AA00FF";
        ctx.fill();
    };
    this.update = () => {
        this.x += this.destination.x / 10;
        this.y += this.destination.y / 10;
        if (!collision(this, {x: width * 0.4, y: height * 0.4, w: width * 1.2, h: height * 1.2})) {
            this.expended = true;
        }
    }
}

function Boom(x, y) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.alpha = 1;
    this.expended = false;
    this.show = () => {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 2 * Math.PI, false);
        ctx.fillStyle = "#FF5500";
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    this.update = () => {
        this.r += 5;
        this.alpha -= 0.1;
        if (this.alpha <= 0) {
            this.expended = true;
        }
    };
}

function Star(x, y, d) {
    this.x = x;
    this.y = y;
    this.w = d;
    this.h = d;
    this.speed = height * 0.015;
    this.show = () => {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.update = () => {
        this.y += this.speed;
        if (this.y > height + this.h) {
            this.w = this.h = Math.random() * 5 + 1;
            this.x = Math.random() * width;
            this.y = -this.h;
        }
    };
}

function Item(name, x, y) {
    this.name = name;
    this.dimensions = {
        "bowler": [50, 35, 50, 2],
        "violin": [40, 70, 100, 6],
        "sax": [50, 70, 100, 6],
        "firstAid": [50, 40, 120, 25],
        "beer": [50, 60, 100, 10],
        "uziAmmo": [50, 50, 50, 0],
        "rocketAmmo": [50, 50, 50, 0]
    };
    this.x = x;
    this.y = y;
    this.w = this.dimensions[this.name][0];
    this.h = this.dimensions[this.name][1];
    this.rot = 0;
    this.speed = 5;
    this.expended = false;
    this.show = () => {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.drawImage(img[this.name], -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.rotate(-this.rot * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
    };
    this.update = () => {
        this.y += this.speed;
        this.expended = this.y > height + this.h;
        if (collision(this, p1)) {
            p1.score+= this.dimensions[this.name][2];
            p1.hp += this.dimensions[this.name][3];
            aud.clone(6);
            if (this.name === "uziAmmo") {
                p1.uziAmmo += 200;
            } else if (this.name === "rocketAmmo") {
                p1.rocketAmmo += 3;
            }
            this.expended = true;
        }
        this.rot++;
    };
}

function Shop() {
    this.x = 0;
    this.y = 0;
    this.w = 120;
    this.h = 100;
    this.xVel = 5;
    this.yVel = 7;
    this.rot = 360 * 2;
    this.stage = 0;
    this.stock = [];
    this.stockPage = 0;
    this.timeoutSet = false;
    this.insufficientFunds = false;
    this.purchaseSpamTimeOutSet = false;
    this.leftButtonCoords = {
        x: width * 0.25,
        y: height * 0.7,
        w: width * 0.2,
        h: height * 0.15
    };
    this.rightButtonCoords = {
        x: width * 0.75,
        y: height * 0.7,
        w: width * 0.2,
        h: height * 0.15
    };
    this.leaveButtonCoords = {
        x: width * 0.5,
        y: height * 0.85,
        w: width * 0.6,
        h: height * 0.1
    };
    this.leftButton = () => {
        if (this.stockPage > 0) {
            let lbc = this.leftButtonCoords;
            ctx.fillStyle = "#444444";
            ctx.fillRect(lbc.x - lbc.w / 2, lbc.y - lbc.h / 2, lbc.w, lbc.h);
            ctx.fillStyle = "#FFFFAA";
            if (collision(mouse, lbc)) {
                cursor("pointer");
                ctx.fillStyle = "#FFFFFF";
                if (mouse.down && !this.purchaseSpamTimeOutSet) {
                    this.stockPage--;
                    setTimeout(() => { this.purchaseSpamTimeOutSet = false }, 500);
                    this.purchaseSpamTimeOutSet = true;
                }
            }
            ctx.beginPath();
            ctx.moveTo(width * 0.3, height * 0.65);
            ctx.lineTo(width * 0.2, height * 0.7);
            ctx.lineTo(width * 0.3, height * 0.75);
            ctx.fill();
        }
    };
    this.rightButton = () => {
        if (this.stockPage < Math.floor((this.stock.length - 1) / 9)) {
            let rbc = this.rightButtonCoords;
            ctx.fillStyle = "#444444";
            ctx.fillRect(rbc.x - rbc.w / 2, rbc.y - rbc.h / 2, rbc.w, rbc.h);
            ctx.fillStyle = "#FFFFAA";
            if (collision(mouse, rbc)) {
                cursor("pointer");
                ctx.fillStyle = "#FFFFFF";
                if (mouse.down && !this.purchaseSpamTimeOutSet) {
                    this.stockPage++;
                    setTimeout(() => { this.purchaseSpamTimeOutSet = false }, 500);
                    this.purchaseSpamTimeOutSet = true;
                }
            }
            ctx.beginPath();
            ctx.moveTo(width * 0.7, height * 0.65);
            ctx.lineTo(width * 0.8, height * 0.7);
            ctx.lineTo(width * 0.7, height * 0.75);
            ctx.fill();
        }
    };
    this.leaveButton = () => {
        let lbc = this.leaveButtonCoords;
        let leaveWordHeight = height * 0.875;
        ctx.fillStyle = "#772F1A";
        ctx.fillRect(lbc.x - lbc.w / 2, lbc.y - lbc.h / 2, lbc.w, lbc.h);
        if (collision(mouse, lbc)) {
            ctx.fillStyle = "#FFFF00";
            cursor("pointer");
            if (mouse.down) {
                leaveWordHeight = height * 0.88;
                if (count.currentLevel === 20) {
                    for (let i = 0; i < stars.length; i++) {
                        stars[i].speed = height * 0.015;
                    }
                }
                if (!this.timeoutSet) {
                    setTimeout(() => {
                        this.stage = 3;
                        this.timeoutSet = false;
                        cursor("default");
                    }, 200);
                    this.timeoutSet = true;
                }
            }
        } else {
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.font = "50px manaspace";
        ctx.fillText("Leave", width / 2, leaveWordHeight);

    };
    this.restock = () => {
        let choices = ["beer", "firstAid", "barrier", "uziAmmo", "rocket"];
        let rnd = Math.ceil(Math.random() * 6);
        for (let i = 0; i < rnd; i++) {
            this.stock.push(new ShopItem(choices[Math.floor(Math.random() * choices.length)]));
        }
    };
    this.shopStock = () => {
        if (shop.stock.length === 0) {
            ctx.font = "20px manaspace";
            ctx.fillText("There is nothing left in stock", width / 2, height * 0.5);
        } else {
            let cell = width * 0.2;
            for (let i = 0; i < this.stock.length - (this.stockPage * 9) && i < 9; i++) {
                let currentItem = this.stock[this.stockPage * 9 + i];
                currentItem.display(i % 3 * cell + cell, Math.floor(i / 3) * cell + cell * 2);
                if (currentItem.expended) {
                    this.stock.splice(i, 1);
                }
            }
        }
    };
    this.show = () => {
        if (this.stage > 0) {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot * Math.PI / 180);
            ctx.drawImage(img.shop, -this.w / 2, -this.h / 2, this.w, this.h);
            ctx.rotate(-this.rot * Math.PI / 180);
            ctx.translate(-this.x, -this.y);
        }
        if (this.stage === 2) {
            ctx.fillStyle = "#2b333f";
            ctx.fillRect(0, 0, width, height);
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "50px manaspace";
            ctx.fillText("SHOP", width / 2, height * 0.2);
            this.shopStock();
            this.leaveButton();
            this.rightButton();
            this.leftButton();
            if (this.insufficientFunds && mouse.down) {
                ctx.fillStyle = "#000";
                ctx.fillRect(width * 0.05, height * 0.45, width * 0.9, height * 0.1);
                ctx.fillStyle = "#FFF";
                ctx.font = "30px manaspace";
                ctx.fillText("Insufficient Funds", width / 2, height / 2);
                ctx.fillStyle = "#FFFF00";
                ctx.font = "15px manaspace";
            }
        }
    };
    this.update = () => {
        switch (this.stage) {
            case 1:
                if (this.x > p1.x + this.xVel) {
                    this.x -= this.xVel;
                } else if (this.x < p1.x - this.xVel) {
                    this.x += this.xVel;
                }
                this.rot *= 0.93;
                if (this.yVel > 1) {
                    this.yVel *= 0.99;
                }
                if (this.y < p1.y - height * 0.1) {
                    this.y += this.yVel;
                } else {
                    this.stage = 2;
                }
                break;
            case 3:
                this.yVel++;
                this.y += this.yVel;
                if (this.y > height) {
                    this.yVel = 7;
                    this.rot = 360 * 2;
                    this.y = this.stage = 0;
                    count.currentLevel++;
                }
                break;
        }
    };
}