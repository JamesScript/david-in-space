"use strict";

function ShopItem(name) {
    var _this = this;

    this.name = name;
    this.expended = false;
    this.itemVar = {
        "beer": [img.beer, 100, function () {
            p1.hp += 10;
        }],
        "firstAid": [img.firstAid, 250, function () {
            p1.hp += 25;
        }],
        "barrier": [img.barrier, 1000, function () {
            p1.barrier += 1;
        }],
        "uziAmmo": [img.uziAmmo, 800, function () {
            p1.uziAmmo += 300;
        }],
        "rocket": [img.rocketAmmo, 2000, function () {
            p1.rocketAmmo += 5;
        }]
    };
    this.display = function (x, y) {
        var sq = width * 0.18;
        ctx.fillStyle = "#005cb7";
        ctx.fillRect(x, y, sq, sq);
        ctx.drawImage(_this.itemVar[_this.name][0], x + 2, y, sq, sq);
        ctx.font = font(15);
        ctx.fillStyle = "#FFF";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(x + width * 0.045, y + width * 0.14, width * 0.09, width * 0.04);
        ctx.globalAlpha = 1;
        var collisionObject = {
            x: x + sq / 2,
            y: y + sq / 2,
            w: sq,
            h: sq
        };
        if (collision(collisionObject, mouse)) {
            ctx.fillStyle = "#FFFF00";
            cursor("pointer");
            shop.insufficientFunds = false;
            if (mouse.down && !shop.purchaseSpamTimeOutSet) {
                if (p1.score < _this.itemVar[_this.name][1]) {
                    shop.insufficientFunds = true;
                } else {
                    p1.score -= _this.itemVar[_this.name][1];
                    p1.totalSpent += _this.itemVar[_this.name][1];
                    shop.purchaseSpamTimeOutSet = true;
                    _this.itemVar[_this.name][2]();
                    _this.expended = true;
                    setTimeout(function () {
                        shop.purchaseSpamTimeOutSet = false;
                    }, 500);
                }
            }
        } else {
            ctx.fillStyle = "#FFF";
        }
        ctx.fillText(_this.itemVar[_this.name][1], x + width * 0.09, y + width * 0.18);
    };
}
//# sourceMappingURL=shopItems.js.map