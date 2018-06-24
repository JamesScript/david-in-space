"use strict";

function Player() {
    var _this = this;

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
    this.show = function () {
        if (_this.hp > 0) {
            var sprite = _this.isCross ? img.dc : img.dj;
            ctx.drawImage(sprite, _this.x - _this.w / 2, _this.y - _this.h / 2, _this.w, _this.h);
        } else {
            _this.death();
        }
    };
    this.update = function () {
        if (mouse.x > _this.w / 2 && mouse.x < width - _this.w / 2) {
            _this.xTarget = mouse.x;
        }
        if (_this.x > _this.xTarget) {
            if (_this.x - _this.xTarget < _this.speed) {
                _this.x -= _this.x - _this.xTarget;
            } else {
                _this.x -= _this.speed;
            }
        } else if (_this.x < _this.xTarget) {
            if (_this.xTarget - _this.x < _this.speed) {
                _this.x += _this.xTarget - _this.x;
            } else {
                _this.x += _this.speed;
            }
        }
        if (mouse.y > _this.h / 2 && mouse.y < height - _this.h / 2) {
            _this.yTarget = mouse.y;
        }
        if (_this.y > _this.yTarget) {
            if (_this.y - _this.yTarget < _this.speed) {
                _this.y -= _this.y - _this.yTarget;
            } else {
                _this.y -= _this.speed;
            }
        } else if (_this.y < _this.yTarget) {
            if (_this.yTarget - _this.y < _this.speed) {
                _this.y += _this.yTarget - _this.y;
            } else {
                _this.y += _this.speed;
            }
        }
        if (mouse.down && _this.equip === 1 && _this.canShoot) {
            _this.shoot();
            _this.canShoot = false;
            setTimeout(function () {
                _this.canShoot = true;
            }, 60);
        }
        if (_this.barrier > 0) {
            ctx.strokeStyle = "#0000FF";
            ctx.lineWidth = Math.sin(count.levelFrame / 10) * 3 + 4;
            for (var i = 0; i < _this.barrier; i++) {
                ctx.beginPath();
                ctx.arc(_this.x, _this.y, width * 0.07 + (i + 1) * width * 0.01, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        _this.contain();
    };
    this.shoot = function () {
        if (shop.stage !== 2 && !paused && count.currentLevel > 0 && p1.hp > 0 && mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height * 0.9) {
            if (_this.equip === 2) {
                if (_this.rocketAmmo > 0) {
                    aud.clone(0); // change to rocket sound
                    bullets.push(new Rocket(_this.x));
                    _this.rocketAmmo--;
                } else {
                    _this.equip = 0;
                }
            } else {
                aud.clone(0);
                bullets.push(new Bullet(_this.x));
                if (_this.equip === 1 && _this.uziAmmo > 0) {
                    _this.uziAmmo--;
                }
                if (_this.uziAmmo <= 0) {
                    _this.equip = 0;
                }
            }
        }
    };
    this.contain = function () {
        if (_this.x < 0) _this.x = 0;
        if (_this.x > width) _this.x = width;
        if (_this.y < 0) _this.y = 0;
        if (_this.y > height) _this.y = height;
        if (_this.hp > _this.maxHp) {
            _this.hp = _this.maxHp;
        }
    };
    this.damage = function (amount) {
        if (_this.barrier <= 0) {
            _this.hp -= amount;
        } else {
            _this.barrier--;
        }
    };
    this.death = function () {
        if (!_this.dead) {
            count.currentLevel = 99;
            booms.push(new Boom(_this.x, _this.y));
            _this.dead = true;
        }
    };
}

function Bullet(x) {
    var _this2 = this;

    this.x = x;
    this.y = p1.y;
    this.w = width * 0.0121;
    this.h = height * 0.0217;
    this.isRocket = false;
    this.speed = height * 0.0145;
    this.expended = false;
    this.show = function () {
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(_this2.x - _this2.w / 2, _this2.y - _this2.h / 2, _this2.w, _this2.h);
    };
    this.update = function () {
        _this2.y -= _this2.speed;
        if (_this2.y < -_this2.h) {
            _this2.expended = true;
        }
    };
}

function Rocket(x) {
    var _this3 = this;

    this.x = x;
    this.y = p1.y;
    this.w = width * 0.0221;
    this.h = height * 0.0317;
    this.isRocket = true;
    this.speed = height * 0.0115;
    this.expended = false;
    this.show = function () {
        ctx.fillStyle = "#AA00FF";
        ctx.fillRect(_this3.x - _this3.w / 2, _this3.y - _this3.h / 2, _this3.w, _this3.h);
    };
    this.update = function () {
        _this3.y -= _this3.speed;
        if (_this3.y < -_this3.h) {
            _this3.expended = true;
        }
    };
}

function shrapnel(x, y) {
    var destinationChoices = [{ x: 0, y: height * 0.12 }, { x: width * 0.04, y: height * 0.08 }, { x: width * 0.08, y: height * 0.04 }, { x: width * 0.12, y: 0 }, { x: width * 0.08, y: height * -0.04 }, { x: width * 0.04, y: height * -0.08 }, { x: 0, y: height * -0.12 }, { x: width * -0.04, y: height * -0.08 }, { x: width * -0.08, y: height * -0.04 }, { x: width * -0.12, y: 0 }, { x: width * -0.08, y: height * 0.04 }, { x: width * -0.04, y: height * 0.08 }];
    setTimeout(function () {
        for (var i = 0; i < 12; i++) {
            bullets.push(new ShrapnelPiece(x, y, destinationChoices[i].x, destinationChoices[i].y));
        }
    }, 10);
}

function ShrapnelPiece(x, y, xVel, yVel) {
    var _this4 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.012;
    this.h = width * 0.012;
    this.expended = false;
    this.isRocket = false;
    this.isShrapnel = true;
    this.destination = { x: xVel, y: yVel };
    this.show = function () {
        ctx.beginPath();
        ctx.arc(_this4.x, _this4.y, _this4.w, 2 * Math.PI, false);
        ctx.fillStyle = "#AA00FF";
        ctx.fill();
    };
    this.update = function () {
        _this4.x += _this4.destination.x / 10;
        _this4.y += _this4.destination.y / 10;
        if (!collision(_this4, { x: width * 0.4, y: height * 0.4, w: width * 1.2, h: height * 1.2 })) {
            _this4.expended = true;
        }
    };
}

function Boom(x, y) {
    var _this5 = this;

    this.x = x;
    this.y = y;
    this.r = 5;
    this.alpha = 1;
    this.expended = false;
    this.show = function () {
        ctx.globalAlpha = _this5.alpha;
        ctx.beginPath();
        ctx.arc(_this5.x, _this5.y, _this5.r, 2 * Math.PI, false);
        ctx.fillStyle = "#FF5500";
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    this.update = function () {
        _this5.r += 5;
        _this5.alpha -= 0.1;
        if (_this5.alpha <= 0) {
            _this5.expended = true;
        }
    };
}

function Star(x, y, d) {
    var _this6 = this;

    this.x = x;
    this.y = y;
    this.w = d;
    this.h = d;
    this.speed = height * 0.015;
    this.show = function () {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(_this6.x, _this6.y, _this6.w, _this6.h);
    };
    this.update = function () {
        _this6.y += _this6.speed;
        if (_this6.y > height + _this6.h) {
            _this6.w = _this6.h = Math.random() * 5 + 1;
            _this6.x = Math.random() * width;
            _this6.y = -_this6.h;
        }
    };
}

function Item(name, x, y) {
    var _this7 = this;

    this.name = name;
    this.dimensions = {
        "bowler": [50, 35, 50, 2],
        "violin": [40, 70, 100, 6],
        "sax": [50, 70, 100, 6],
        "firstAid": [50, 40, 120, 25],
        "beer": [50, 60, 100, 10],
        "uziAmmo": [50, 50, 50, 0],
        "rocketAmmo": [50, 50, 50, 0],
        "barrier": [50, 50, 100, 0]
    };
    this.x = x;
    this.y = y;
    this.w = this.dimensions[this.name][0];
    this.h = this.dimensions[this.name][1];
    this.rot = 0;
    this.speed = 5;
    this.expended = false;
    this.show = function () {
        ctx.translate(_this7.x, _this7.y);
        ctx.rotate(_this7.rot * Math.PI / 180);
        ctx.drawImage(img[_this7.name], -_this7.w / 2, -_this7.h / 2, _this7.w, _this7.h);
        ctx.rotate(-_this7.rot * Math.PI / 180);
        ctx.translate(-_this7.x, -_this7.y);
    };
    this.update = function () {
        _this7.y += _this7.speed;
        _this7.expended = _this7.y > height + _this7.h;
        if (collision(_this7, p1)) {
            p1.score += _this7.dimensions[_this7.name][2];
            p1.hp += _this7.dimensions[_this7.name][3];
            aud.clone(6);
            if (_this7.name === "uziAmmo") {
                p1.uziAmmo += 200;
            } else if (_this7.name === "rocketAmmo") {
                p1.rocketAmmo += 3;
            } else if (_this7.name === "barrier") {
                p1.barrier++;
            }
            _this7.expended = true;
        }
        _this7.rot++;
    };
}

function Shop() {
    var _this8 = this;

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
    this.leftButton = function () {
        if (_this8.stockPage > 0) {
            var lbc = _this8.leftButtonCoords;
            ctx.fillStyle = "#444444";
            ctx.fillRect(lbc.x - lbc.w / 2, lbc.y - lbc.h / 2, lbc.w, lbc.h);
            ctx.fillStyle = "#FFFFAA";
            if (collision(mouse, lbc)) {
                cursor("pointer");
                ctx.fillStyle = "#FFFFFF";
                if (mouse.down && !_this8.purchaseSpamTimeOutSet) {
                    _this8.stockPage--;
                    setTimeout(function () {
                        _this8.purchaseSpamTimeOutSet = false;
                    }, 500);
                    _this8.purchaseSpamTimeOutSet = true;
                }
            }
            ctx.beginPath();
            ctx.moveTo(width * 0.3, height * 0.65);
            ctx.lineTo(width * 0.2, height * 0.7);
            ctx.lineTo(width * 0.3, height * 0.75);
            ctx.fill();
        }
    };
    this.rightButton = function () {
        if (_this8.stockPage < Math.floor((_this8.stock.length - 1) / 9)) {
            var rbc = _this8.rightButtonCoords;
            ctx.fillStyle = "#444444";
            ctx.fillRect(rbc.x - rbc.w / 2, rbc.y - rbc.h / 2, rbc.w, rbc.h);
            ctx.fillStyle = "#FFFFAA";
            if (collision(mouse, rbc)) {
                cursor("pointer");
                ctx.fillStyle = "#FFFFFF";
                if (mouse.down && !_this8.purchaseSpamTimeOutSet) {
                    _this8.stockPage++;
                    setTimeout(function () {
                        _this8.purchaseSpamTimeOutSet = false;
                    }, 500);
                    _this8.purchaseSpamTimeOutSet = true;
                }
            }
            ctx.beginPath();
            ctx.moveTo(width * 0.7, height * 0.65);
            ctx.lineTo(width * 0.8, height * 0.7);
            ctx.lineTo(width * 0.7, height * 0.75);
            ctx.fill();
        }
    };
    this.leaveButton = function () {
        var lbc = _this8.leaveButtonCoords;
        var leaveWordHeight = height * 0.875;
        ctx.fillStyle = "#772F1A";
        ctx.fillRect(lbc.x - lbc.w / 2, lbc.y - lbc.h / 2, lbc.w, lbc.h);
        if (collision(mouse, lbc)) {
            ctx.fillStyle = "#FFFF00";
            cursor("pointer");
            if (mouse.down) {
                leaveWordHeight = height * 0.88;
                if (count.currentLevel === 20) {
                    for (var i = 0; i < stars.length; i++) {
                        stars[i].speed = height * 0.015;
                    }
                }
                if (!_this8.timeoutSet) {
                    setTimeout(function () {
                        _this8.stage = 3;
                        _this8.timeoutSet = false;
                        cursor("default");
                    }, 200);
                    _this8.timeoutSet = true;
                }
            }
        } else {
            ctx.fillStyle = "#FFFFFF";
        }
        ctx.font = font(50);
        ctx.fillText("Leave", width / 2, leaveWordHeight);
    };
    this.restock = function () {
        var choices = ["beer", "firstAid", "barrier", "uziAmmo", "rocket"];
        var rnd = Math.ceil(Math.random() * 6);
        for (var i = 0; i < rnd; i++) {
            _this8.stock.push(new ShopItem(choices[Math.floor(Math.random() * choices.length)]));
        }
    };
    this.shopStock = function () {
        if (shop.stock.length === 0) {
            ctx.font = font(20);
            ctx.fillText("There is nothing left in stock", width / 2, height * 0.5);
        } else {
            var cell = width * 0.2;
            for (var i = 0; i < _this8.stock.length - _this8.stockPage * 9 && i < 9; i++) {
                var currentItem = _this8.stock[_this8.stockPage * 9 + i];
                currentItem.display(i % 3 * cell + cell, Math.floor(i / 3) * cell + cell * 2);
                if (currentItem.expended) {
                    _this8.stock.splice(i + _this8.stockPage * 9, 1);
                }
            }
        }
    };
    this.show = function () {
        if (_this8.stage > 0) {
            ctx.translate(_this8.x, _this8.y);
            ctx.rotate(_this8.rot * Math.PI / 180);
            ctx.drawImage(img.shop, -_this8.w / 2, -_this8.h / 2, _this8.w, _this8.h);
            ctx.rotate(-_this8.rot * Math.PI / 180);
            ctx.translate(-_this8.x, -_this8.y);
        }
        if (_this8.stage === 2) {
            ctx.fillStyle = "#2b333f";
            ctx.fillRect(0, 0, width, height);
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.font = font(50);
            ctx.fillText("SHOP", width / 2, height * 0.2);
            _this8.shopStock();
            _this8.leaveButton();
            _this8.rightButton();
            _this8.leftButton();
            if (_this8.insufficientFunds && mouse.down) {
                ctx.fillStyle = "#000";
                ctx.fillRect(width * 0.05, height * 0.45, width * 0.9, height * 0.1);
                ctx.fillStyle = "#FFF";
                ctx.font = font(30);
                ctx.fillText("Insufficient Funds", width / 2, height / 2);
                ctx.fillStyle = "#FFFF00";
                ctx.font = font(15);
            }
        }
    };
    this.update = function () {
        switch (_this8.stage) {
            case 1:
                if (_this8.x > p1.x + _this8.xVel) {
                    _this8.x -= _this8.xVel;
                } else if (_this8.x < p1.x - _this8.xVel) {
                    _this8.x += _this8.xVel;
                }
                _this8.rot *= 0.93;
                if (_this8.yVel > 1) {
                    _this8.yVel *= 0.99;
                }
                if (_this8.y < p1.y - height * 0.1) {
                    _this8.y += _this8.yVel;
                } else {
                    _this8.stage = 2;
                    if (isMobile) {
                        mouse.x = mouse.y = 0;
                    }
                }
                break;
            case 3:
                _this8.yVel++;
                _this8.y += _this8.yVel;
                if (_this8.y > height) {
                    _this8.yVel = 7;
                    _this8.rot = 360 * 2;
                    _this8.y = _this8.stage = 0;
                    count.currentLevel++;
                }
                break;
        }
    };
}
//# sourceMappingURL=objects.js.map