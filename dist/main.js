'use strict';

var get = function get(id) {
    return document.getElementById(id);
};
var c = get("gameCanvas");
var gc = $('#gameCanvas');
var body = $('body');
var p1 = new Player();
var count = new CountRegister();
var shop = new Shop();
var enemies = [];
var bullets = [];
var booms = [];
var stars = [];
var items = [];
var mouse = {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    down: false
};
var ctx = void 0;
var img = {
    dc: get("cross"),
    dj: get("jackson"),
    pistol: get("pistol"),
    uzi: get("uzi"),
    rocketLauncher: get("rocketLauncher"),
    bowler: get("bowler"),
    violin: get("violin"),
    sax: get("sax"),
    enemy: get("enemy"),
    greenAlien: get("greenAlien"),
    skullAlien: get("skullAlien"),
    toothAlien: get("toothAlien"),
    eyeballAlien: get("eyeballAlien"),
    tongueAlien: get("tongueAlien"),
    boss: get("boss"),
    bossSpawn: get("bossSpawn"),
    meteorite: get("meteorite"),
    bacteriophage: get("bacteriophage"),
    finalBoss: get("finalBoss"),
    firstAid: get("firstAid"),
    uziAmmo: get("uziAmmo"),
    rocketAmmo: get("rocketAmmo"),
    beer: get("beer"),
    barrier: get("barrier"),
    shop: get("shop")
};
var aud = new Sound("audioSpriteTest.mp3");
var hammertime = new Hammer(c);
var isMobile = checkIfMobile();
var paused = false;
var personalBest = 0;
var testCoords = [0, 0];

function init() {
    checkCookie("dcdjScore");
    count.createLevelLengthsArray();
    shop.x = width / 2;
    ctx = c.getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.imageSmoothingEnabled = false;
    ctx.font = font(20);
    for (var i = 0; i < 20; i++) {
        stars[i] = new Star(Math.random() * width, Math.random() * height, Math.random() * 5 + 1);
    }
    // enemies[0] = new Enemy(width / 2, 0);
    shop.stock.push(new ShopItem("beer"));
    shop.stock.push(new ShopItem("firstAid"));
    shop.stock.push(new ShopItem("uziAmmo"));
    shop.stock.push(new ShopItem("rocket"));
    shop.stock.push(new ShopItem("barrier"));
    if (isMobile && window.innerWidth > window.innerHeight) {
        alert("If you are using mobile please switch to portrait view and reload this page.");
    }
}

function render() {
    cursor("default"); // gets overriden, placed to avoid carry-over glitches
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    if (paused) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.fillText("Paused", width / 2, height / 2);
    } else {
        count.currentLevel === 0 ? menu() : gameScript();
    }
    ctx.fillText("CURRENTLY BEING EDITED", width / 5, height * 0.1);
    ctx.fillText(testCoords, width / 2, height * 0.9);
    console.log(testCoords);
    requestAnimationFrame(render);
}

function menu() {
    var dcBlock = {
        x: width * 0.5,
        y: height * 0.45,
        w: width * 0.4,
        h: height * 0.238,
        selected: false
    };
    var djBlock = {
        x: width * 0.5,
        y: height * 0.75,
        w: width * 0.4,
        h: height * 0.238,
        selected: false
    };
    dcBlock.selected = collision(mouse, dcBlock);
    djBlock.selected = collision(mouse, djBlock);
    dcBlock.selected || djBlock.selected ? cursor("pointer") : cursor("default");
    ctx.fillStyle = dcBlock.selected ? "#58ff3e" : "#818084";
    ctx.fillRect(dcBlock.x - dcBlock.w / 2, dcBlock.y - dcBlock.h / 2, dcBlock.w, dcBlock.h);
    ctx.fillStyle = djBlock.selected ? "#58ff3e" : "#818084";
    ctx.fillRect(djBlock.x - djBlock.w / 2, djBlock.y - djBlock.h / 2, djBlock.w, djBlock.h);
    ctx.fillStyle = "#ffe827";
    ctx.font = font(30);
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE YOUR DAVID", width * 0.5, height * 0.2);
    if (personalBest > 0) {
        ctx.font = font(20);
        ctx.fillText("Personal Best: " + personalBest, width * 0.5, height * 0.3);
        ctx.font = font(30);
    }
    ctx.fillStyle = dcBlock.selected ? "#FFFFFF" : "#b29739";
    ctx.fillText("CROSS", width * 0.5, height * 0.38);
    ctx.fillStyle = djBlock.selected ? "#FFFFFF" : "#b29739";
    ctx.fillText("JACKSON", width * 0.5, height * 0.68);
    ctx.drawImage(img.dc, width / 2 - p1.w, height * 0.4, p1.w * 2, p1.h * 2);
    ctx.drawImage(img.dj, width / 2 - p1.w, height * 0.7, p1.w * 2, p1.h * 2);
    if ((dcBlock.selected || djBlock.selected) && mouse.down) count.currentLevel = 1;
    p1.isCross = dcBlock.selected;
}

function gameScript() {
    var objects = [stars, bullets, booms, items, enemies, [shop, p1]];
    for (var i = 0; i < objects.length; i++) {
        for (var j = objects[i].length - 1; j >= 0; j--) {
            objects[i][j].show();
            objects[i][j].update();
            if ("expended" in objects[i][j] && objects[i][j].expended) {
                objects[i].splice(j, 1);
            }
        }
    }
    count.go();
    display();
}

function display() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, height * 0.915, width, height * 0.085);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000000";
    ctx.font = font(18);
    ctx.textAlign = "left";
    ctx.fillText("Davcoin: " + p1.score, 30, height * 0.95);
    ctx.fillText("HP", 30, height * 0.98);
    ctx.fillStyle = "#000000";
    var lifebarWidth = width / 3;
    ctx.fillRect(60, height * 0.96, lifebarWidth, height * 0.02);
    if (p1.hp > 0) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(60, height * 0.96, p1.hp / p1.maxHp * lifebarWidth, height * 0.02);
    }
    arsenal();
}

function arsenal() {
    var pistolCoords = {
        x: width * 0.59,
        y: height * 0.96,
        w: width * 0.12,
        h: height * 0.065
    };
    var uziCoords = {
        x: width * 0.72,
        y: height * 0.96,
        w: width * 0.12,
        h: height * 0.065
    };
    var rocketCoords = {
        x: width * 0.88,
        y: height * 0.96,
        w: width * 0.17,
        h: height * 0.065
    };
    p1.equip === 0 ? ctx.fillStyle = "#FFFF00" : ctx.fillStyle = "#999999";
    ctx.fillRect(pistolCoords.x - pistolCoords.w / 2, pistolCoords.y - pistolCoords.h / 2, pistolCoords.w, pistolCoords.h);
    p1.equip === 1 ? ctx.fillStyle = "#FFFF00" : ctx.fillStyle = "#999999";
    ctx.fillRect(uziCoords.x - uziCoords.w / 2, uziCoords.y - uziCoords.h / 2, uziCoords.w, uziCoords.h);
    p1.equip === 2 ? ctx.fillStyle = "#FFFF00" : ctx.fillStyle = "#999999";
    ctx.fillRect(rocketCoords.x - rocketCoords.w / 2, rocketCoords.y - rocketCoords.h / 2, rocketCoords.w, rocketCoords.h);
    ctx.drawImage(img.pistol, pistolCoords.x - pistolCoords.w / 2, pistolCoords.y - pistolCoords.h / 2, pistolCoords.w * 0.9, pistolCoords.h * 0.9);
    ctx.drawImage(img.uzi, uziCoords.x - uziCoords.w / 2, uziCoords.y - uziCoords.h / 2, uziCoords.w * 0.9, uziCoords.h * 0.9);
    ctx.drawImage(img.rocketLauncher, rocketCoords.x - rocketCoords.w / 2, rocketCoords.y - rocketCoords.h / 2, rocketCoords.w * 0.9, rocketCoords.h * 0.9);
    if (collision(pistolCoords, mouse) && mouse.down) {
        p1.equip = 0;
    }
    if (collision(uziCoords, mouse) && mouse.down) {
        p1.equip = 1;
    }
    if (collision(rocketCoords, mouse) && mouse.down) {
        p1.equip = 2;
    }
    ctx.fillStyle = "#4444FF";
    ctx.fillText(p1.uziAmmo.toString(), uziCoords.x - uziCoords.w / 2, uziCoords.y - uziCoords.h / 3);
    ctx.fillText(p1.rocketAmmo.toString(), rocketCoords.x, rocketCoords.y - rocketCoords.h / 3);
}

function bulletHit(bullet) {
    if (bullet.isRocket) {
        bigBoom(bullet.x, bullet.y, 7, 500);
        shrapnel(bullet.x, bullet.y);
        return p1.rocketDamage;
    } else if ("isShrapnel" in bullet) {
        return 5;
    } else {
        return 1;
    }
}

function bigBoom(x, y, magnitude, time) {
    var _loop = function _loop(j) {
        var rndX = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
        var rndY = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
        setTimeout(function () {
            booms.push(new Boom(x + rndX, y + rndY));
        }, Math.floor(Math.random() * time));
    };

    for (var j = 0; j < magnitude; j++) {
        _loop(j);
    }
}

function drop(x, y, nothing, bowler, sax, violin, firstAid, beer, uziAmmo, rocket, barrier) {
    var rollDice = enemyDrop(nothing, bowler, sax, violin, firstAid, beer, uziAmmo, rocket, barrier);
    if (rollDice !== "nothing") items.push(new Item(rollDice, x, y));
}

function enemyDrop(nothing, bowler, sax, violin, firstAid, beer, uziAmmo, rocket, barrier) {
    var choices = ["nothing", "bowler", "sax", "violin", "firstAid", "beer", "uziAmmo", "rocketAmmo", "barrier"];
    var args = Array.prototype.slice.call(arguments);
    var totalProportions = args.reduce(function (a, b) {
        return a + b;
    });
    var rnd = Math.floor(Math.random() * totalProportions);
    var totalNumber = 0;
    for (var i = 0; i < args.length; i++) {
        if (rnd < args[i] + totalNumber) {
            return choices[i];
        } else {
            totalNumber += args[i];
        }
    }
}

var pressOptions = {
    event: 'press',
    // pointer: 1,
    threshold: 1,
    time: 1
};

hammertime.get('press').set(pressOptions);

hammertime.on('pan', function (ev) {
    mouse.x = ev.srcEvent.pageX - gc.offset().left;
    mouse.y = ev.srcEvent.pageY - gc.offset().top;
    if (p1.x < 0) p1.x = 0;
    if (p1.x > width) p1.x = width;
});

document.body.addEventListener("click", function () {
    p1.shoot();
}, false);

document.body.addEventListener("mousemove", function (e) {
    handleMouse(e);
}, false);

document.body.addEventListener("mousedown", function () {
    mouse.down = true;
}, false);

document.body.addEventListener("mouseup", function () {
    mouse.down = false;
}, false);

document.body.addEventListener("touchstart", function (e) {
    mouse.x = e.touches[0].pageX;
    mouse.y = e.touches[0].pageY;
    mouse.down = true;
}, false);

document.body.addEventListener("touchend", function () {
    mouse.down = false;
}, false);

if (!isMobile) {
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 112) {
            paused = !paused;
        }
    });
}

init();
render();
//# sourceMappingURL=main.js.map