"use strict";

function Enemy(x, y) {
    var _this = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.072;
    this.hp = 1;
    this.xVel = width * 0.012;
    this.yVel = height * 0.007;
    this.maxVel = width * 0.025;
    this.expended = false;
    this.show = function () {
        ctx.drawImage(img.enemy, _this.x - _this.w / 2, _this.y - _this.h / 2, _this.w, _this.h);
    };
    this.update = function () {
        if (Math.abs(_this.x - p1.x) < 20) {
            _this.maxVel = mapNums(_this.y, 0, height, 12, 2);
        }
        if (_this.x > p1.x) {
            if (_this.xVel > -_this.maxVel) {
                _this.xVel -= width * 0.0025;
            }
        } else if (_this.x < p1.x) {
            if (_this.xVel < _this.maxVel) {
                _this.xVel += width * 0.0025;
            }
        }
        _this.y += _this.yVel;
        _this.x += _this.xVel;
        for (var i = 0; i < bullets.length; i++) {
            if (collision(bullets[i], _this)) {
                _this.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                booms.push(new Boom(_this.x, _this.y));
                if (_this.hp <= 0) {
                    drop(_this.x, _this.y, 25, 8, 0, 0, 1, 1, 4, 1, 1);
                    p1.score += 10;
                    _this.expended = true;
                }
            }
        }
        if (collision(_this, p1)) {
            p1.damage(10);
            booms.push(new Boom(_this.x, _this.y));
            _this.expended = true;
        }
        if (_this.y > height + _this.h) {
            _this.expended = true;
        }
    };
}

function GreenAlien(x, y) {
    var _this2 = this;

    this.x = width / 2;
    this.y = y;
    this.w = width * 0.24;
    this.h = height * 0.072;
    this.yVel = 1;
    this.stage = "enter";
    this.patrolFrame = 0;
    this.hp = 5;
    this.expended = false;
    this.dir = Math.round(Math.random());
    this.show = function () {
        ctx.drawImage(img.greenAlien, _this2.x - _this2.w / 2, _this2.y - _this2.h / 2, _this2.w, _this2.h);
    };
    this.update = function () {
        _this2[_this2.stage]();
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this2, bullets[i])) {
                _this2.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                if (_this2.hp <= 0) {
                    drop(_this2.x, _this2.y, 10, 0, 5, 5, 0, 0, 1, 1, 1);
                    booms.push(new Boom(_this2.x, _this2.y));
                    p1.score += 50;
                    _this2.expended = true;
                }
            }
        }
        if (collision(_this2, p1)) {
            p1.damage(20);
            booms.push(new Boom(_this2.x, _this2.y));
            _this2.expended = true;
        }
        if (_this2.y > height + _this2.h) {
            _this2.expended = true;
        }
    };
    this.enter = function () {
        if (_this2.y < height * 0.2) {
            _this2.y += 10;
        } else {
            _this2.stage = "patrol";
        }
    };
    this.patrol = function () {
        if (_this2.patrolFrame < 40) {
            if (_this2.dir === 0) {
                _this2.x = Math.sin(_this2.patrolFrame) * width / 3 + width / 2;
                _this2.y = height * 0.2 + Math.sin(_this2.patrolFrame / 2) * height / 6;
            } else {
                _this2.x = -Math.sin(_this2.patrolFrame) * width / 3 + width / 2;
                _this2.y = height * 0.2 + -Math.sin(_this2.patrolFrame / 2) * height / 6;
            }
            _this2.patrolFrame += 0.1;
        } else {
            _this2.stage = "charge";
        }
    };
    this.charge = function () {
        if (_this2.x > p1.x) {
            _this2.x -= (_this2.x - p1.x) / 5;
        } else if (_this2.x < p1.x) {
            _this2.x += (p1.x - _this2.x) / 5;
        }
        _this2.y += _this2.yVel;
        _this2.yVel++;
    };
}

function SkullAlien(x, y) {
    var _this3 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.09;
    this.h = height * 0.072;
    this.yVel = height * 0.012;
    this.hp = 2;
    this.expended = false;
    this.show = function () {
        ctx.drawImage(img.skullAlien, _this3.x - _this3.w / 2, _this3.y - _this3.h / 2, _this3.w, _this3.h);
    };
    this.update = function () {
        _this3.y += _this3.yVel;
        _this3.yVel *= 0.95;
        if (_this3.yVel < height * 0.0014) _this3.yVel = height * 0.012;
        _this3.expended = _this3.y > height + _this3.h;
        if (collision(_this3, p1)) {
            _this3.expended = true;
            p1.damage(15);
            booms.push(new Boom(_this3.x, _this3.y));
        }
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this3, bullets[i])) {
                _this3.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                if (_this3.hp <= 0) {
                    drop(_this3.x, _this3.y, 25, 5, 2, 2, 1, 1, 1, 1, 1);
                    booms.push(new Boom(_this3.x, _this3.y));
                    p1.score += 40;
                    _this3.expended = true;
                }
            }
        }
    };
}

function ToothAlien(x, y) {
    var _this4 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.146;
    this.h = height * 0.086;
    this.xVel = height * 0.0145;
    this.hp = 3;
    this.expended = false;
    this.show = function () {
        ctx.drawImage(img.toothAlien, _this4.x - _this4.w / 2, _this4.y - _this4.h / 2, _this4.w, _this4.h);
    };
    this.update = function () {
        _this4.y += 8;
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this4, bullets[i])) {
                _this4.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                if (_this4.hp <= 0) {
                    drop(_this4.x, _this4.y, 20, 3, 3, 3, 4, 6, 1, 1, 1);
                    booms.push(new Boom(_this4.x, _this4.y));
                    p1.score += 50;
                    _this4.expended = true;
                }
            }
        }
        if (collision(_this4, p1)) {
            p1.damage(15);
            booms.push(new Boom(_this4.x, _this4.y));
            _this4.expended = true;
        }
        if (_this4.y > height + _this4.h) {
            _this4.expended = true;
        }
    };
}

function TongueAlien(x, y) {
    var _this5 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.146;
    this.h = height * 0.086;
    this.yVel = height * 0.004;
    this.hp = 3;
    this.expended = false;
    this.shootingTimeoutSet = false;
    this.show = function () {
        ctx.drawImage(img.tongueAlien, _this5.x - _this5.w / 2, _this5.y - _this5.h / 2, _this5.w, _this5.h);
    };
    this.update = function () {
        _this5.y += _this5.yVel;
        if (!_this5.shootingTimeoutSet) {
            var rnd = Math.floor(Math.random() * 2000) + 500;
            setTimeout(function () {
                enemies.push(new TongueAlienBullet(_this5.x, _this5.y));
                _this5.shootingTimeoutSet = false;
            }, rnd);
            _this5.shootingTimeoutSet = true;
        }
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this5, bullets[i])) {
                _this5.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                if (_this5.hp <= 0) {
                    drop(_this5.x, _this5.y, 25, 6, 1, 1, 5, 5, 3, 10, 1);
                    booms.push(new Boom(_this5.x, _this5.y));
                    p1.score += 50;
                    _this5.expended = true;
                }
            }
        }
        if (collision(_this5, p1)) {
            p1.damage(15);
            booms.push(new Boom(_this5.x, _this5.y));
            _this5.expended = true;
        }
        if (_this5.y > height + _this5.h) {
            _this5.expended = true;
        }
    };
}

function TongueAlienBullet(x, y) {
    var _this6 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.0121;
    this.h = height * 0.0217;
    this.speed = height * 0.01;
    this.expended = false;
    this.show = function () {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(_this6.x - _this6.w / 2, _this6.y - _this6.h / 2, _this6.w, _this6.h);
    };
    this.update = function () {
        _this6.y += _this6.speed;
        if (_this6.y > height * 1.1) {
            _this6.expended = true;
        }
        if (collision(_this6, p1)) {
            p1.damage(10);
            _this6.expended = true;
        }
    };
}

function Meteorite(x, y, speed) {
    var _this7 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.072;
    this.speed = speed;
    this.hp = 10;
    this.rot = 0;
    this.expended = false;
    this.show = function () {
        ctx.translate(_this7.x, _this7.y);
        ctx.rotate(_this7.rot * Math.PI / 180);
        ctx.drawImage(img.meteorite, -_this7.w / 2, -_this7.h / 2, _this7.w, _this7.h);
        ctx.rotate(-_this7.rot * Math.PI / 180);
        ctx.translate(-_this7.x, -_this7.y);
    };
    this.update = function () {
        _this7.y += _this7.speed;
        _this7.rot++;
        _this7.expended = _this7.y > height + _this7.h;
        for (var i = bullets.length - 1; i >= 0; i--) {
            if (collision(_this7, bullets[i])) {
                aud.clone(2);
                bullets[i].expended = true;
                _this7.hp -= bulletHit(bullets[i]);
                if (_this7.hp <= 0) {
                    items.push(new Item("firstAid", _this7.x, _this7.y));
                    _this7.expended = true;
                    count.bossKilled = true;
                    booms.push(new Boom(_this7.x, _this7.y));
                    p1.score += 80;
                }
            }
        }
        if (collision(_this7, p1)) {
            _this7.expended = true;
            booms.push(new Boom(_this7.x, _this7.y));
            p1.damage(30);
        }
    };
}

function Boss(x, y) {
    var _this8 = this;

    this.x = x;
    this.y = y;
    this.w = count.currentLevel === 9 ? width * 0.36 : width * 0.4;
    this.h = height * 0.173;
    this.hp = count.currentLevel === 9 ? 120 : 260;
    this.spawns = count.currentLevel === 9 ? BossSpawn : ToothAlien;
    this.patrolFrame = 0;
    this.expended = false;
    this.stage = "enter";
    this.fireTimeoutSet = false;
    this.hitTimeoutSet = false;
    this.canTakeDamage = true;
    this.sprite = count.currentLevel === 9 ? img.boss : img.finalBoss;
    this.show = function () {
        ctx.drawImage(_this8.sprite, _this8.x - _this8.w / 2, _this8.y - _this8.h / 2, _this8.w, _this8.h);
    };
    this.update = function () {
        _this8[_this8.stage]();
        if (collision(_this8, p1) && !_this8.hitTimeoutSet) {
            p1.damage(20);
            booms.push(new Boom(_this8.x, _this8.y));
            setTimeout(function () {
                _this8.hitTimeoutSet = false;
            }, 1000);
            _this8.hitTimeoutSet = true;
        }
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this8, bullets[i])) {
                bullets[i].expended = true;
                aud.clone(2);
                if (_this8.canTakeDamage) {
                    _this8.hp -= bulletHit(bullets[i]);
                    if (bullets[i].isRocket) {
                        _this8.canTakeDamage = false;
                        setTimeout(function () {
                            _this8.canTakeDamage = true;
                        }, 1000);
                    }
                }
                if (_this8.hp <= 0) {
                    drop(_this8.x, _this8.y, 0, 0, 0, 0, 0, 0, 1, 1, 1);
                    booms.push(new Boom(_this8.x, _this8.y));
                    p1.score += 2000;
                    _this8.expended = count.bossKilled = true;
                    bigBoom(_this8.x, _this8.y, 15, 1000);
                }
            }
        }
    };
    this.enter = function () {
        _this8.y += height * 0.01;
        if (_this8.y > height * 0.2) {
            _this8.stage = "firing";
        }
    };
    this.firing = function () {
        if (!_this8.fireTimeoutSet && p1.hp > 0) {
            var rndTime = Math.floor(Math.random() * 400) + 200;
            var rndPos = Math.floor(Math.random() * 100) - 50;
            setTimeout(function () {
                enemies.push(new _this8.spawns(_this8.x + rndPos, _this8.y));
                _this8.fireTimeoutSet = false;
            }, rndTime);
            _this8.fireTimeoutSet = true;
        }
        if (_this8.patrolFrame < 40) {
            _this8.x = Math.sin(_this8.patrolFrame) * width / 3 + width / 2;
            _this8.y = height * 0.2 + Math.sin(_this8.patrolFrame / 2) * height / 6;
            _this8.patrolFrame += 0.1;
        } else {
            _this8.patrolFrame = 0;
            _this8.stage = "rise";
        }
    };
    this.rise = function () {
        _this8.y -= height * 0.01;
        if (_this8.y < -0.1 * height) {
            _this8.x = Math.floor(Math.random() * (width * 0.9) + width * 0.05);
            _this8.stage = "charge";
        }
    };
    this.charge = function () {
        _this8.y += height * 0.02;
        if (_this8.y > height * 1.05) {
            _this8.y = -0.1 * height;
            _this8.x = width / 2;
            _this8.stage = "enter";
        }
    };
}

function BossSpawn(x, y) {
    var _this9 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.073;
    this.h = height * 0.072;
    this.hp = 1;
    this.expended = false;
    this.show = function () {
        ctx.drawImage(img.bossSpawn, _this9.x - _this9.w / 2, _this9.y - _this9.h / 2, _this9.w, _this9.h);
    };
    this.update = function () {
        _this9.y += height * 0.0072;
        if (_this9.y > height) {
            _this9.expended = true;
        }
        for (var i = 0; i < bullets.length; i++) {
            if (collision(bullets[i], _this9)) {
                _this9.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                booms.push(new Boom(_this9.x, _this9.y));
                if (_this9.hp <= 0) {
                    drop(_this9.x, _this9.y, 25, 10, 1, 1, 1, 1, 2, 1, 1);
                    p1.score += 10;
                    _this9.expended = true;
                }
            }
        }
        if (collision(_this9, p1)) {
            p1.damage(10);
            booms.push(new Boom(_this9.x, _this9.y));
            _this9.expended = true;
        }
    };
}

function EyeballAlien(x, y) {
    var _this10 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.072;
    this.xVel = 5;
    this.yVel = 5;
    this.hp = 3;
    this.maxVel = 10;
    this.expended = false;
    this.show = function () {
        ctx.drawImage(img.eyeballAlien, _this10.x - _this10.w / 2, _this10.y - _this10.h / 2, _this10.w, _this10.h);
    };
    this.update = function () {
        if (Math.abs(_this10.x - p1.x) < 20) {
            _this10.maxVel = mapNums(_this10.y, 0, height, 12, 2);
        }
        if (_this10.x > p1.x) {
            if (_this10.xVel > -_this10.maxVel) {
                _this10.xVel -= 1;
            }
        } else if (_this10.x < p1.x) {
            if (_this10.xVel < _this10.maxVel) {
                _this10.xVel += 1;
            }
        }
        _this10.y += _this10.yVel;
        _this10.x += _this10.xVel;
        for (var i = 0; i < bullets.length; i++) {
            if (collision(_this10, bullets[i])) {
                _this10.hp -= bulletHit(bullets[i]);
                aud.clone(2);
                bullets[i].expended = true;
                if (_this10.hp <= 0) {
                    drop(_this10.x, _this10.y, 10, 1, 1, 1, 1, 1, 2, 2, 1);
                    booms.push(new Boom(_this10.x, _this10.y));
                    p1.score += 50;
                    _this10.expended = true;
                }
            }
        }
        if (collision(_this10, p1)) {
            p1.damage(20);
            booms.push(new Boom(_this10.x, _this10.y));
            _this10.expended = true;
        }
    };
}

function Bacteriophage(x, y, speed) {
    var _this11 = this;

    this.x = x;
    this.y = y;
    this.w = width * 0.12;
    this.h = height * 0.1;
    this.speed = speed;
    this.hp = 15;
    this.rot = 0;
    this.expended = false;
    this.show = function () {
        ctx.translate(_this11.x, _this11.y);
        ctx.rotate(_this11.rot * Math.PI / 180);
        ctx.drawImage(img.bacteriophage, -_this11.w / 2, -_this11.h / 2, _this11.w, _this11.h);
        ctx.rotate(-_this11.rot * Math.PI / 180);
        ctx.translate(-_this11.x, -_this11.y);
    };
    this.update = function () {
        _this11.y += _this11.speed;
        _this11.rot++;
        _this11.expended = _this11.y > height + _this11.h;
        for (var i = bullets.length - 1; i >= 0; i--) {
            if (collision(_this11, bullets[i])) {
                aud.clone(2);
                bullets[i].expended = true;
                _this11.hp -= bulletHit(bullets[i]);
                if (_this11.hp <= 0) {
                    items.push(new Item("rocketAmmo", _this11.x, _this11.y));
                    _this11.expended = true;
                    count.bossKilled = true;
                    booms.push(new Boom(_this11.x, _this11.y));
                    p1.score += 80;
                }
            }
        }
        if (collision(_this11, p1)) {
            _this11.expended = true;
            booms.push(new Boom(_this11.x, _this11.y));
            p1.damage(30);
        }
    };
}
//# sourceMappingURL=enemies.js.map