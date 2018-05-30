const get = id => document.getElementById(id);
const c = get("gameCanvas");
const gc = $('#gameCanvas');
const body = $('body');
let p1 = new Player();
let count = new CountRegister();
let shop = new Shop();
let enemies = [];
let bullets = [];
let booms = [];
let stars = [];
let items = [];
let mouse = {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    down: false
};
let ctx;
let img = {
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
    firstAid: get("firstAid"),
    uziAmmo: get("uziAmmo"),
    rocketAmmo: get("rocketAmmo"),
    beer: get("beer"),
    shop: get("shop")
};
let aud = new Sound("audioSpriteTest.mp3");
let hammertime = new Hammer(c);
let isMobile = checkIfMobile();
let paused = false;

function init() {
    count.createLevelLengthsArray();
    shop.x = width / 2;
    ctx = c.getContext("2d");
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.imageSmoothingEnabled = false;
    ctx.font = "20px manaspace";
    for (let i = 0; i < 20; i++) {
        stars[i] = new Star(Math.random() * width, Math.random() * height, Math.random() * 5 + 1);
    }
    enemies[0] = new Enemy(width / 2, 0);
    shop.stock.push(new ShopItem("beer"));
    shop.stock.push(new ShopItem("firstAid"));
    if (isMobile && window.innerWidth > window.innerHeight) {
        alert("If you are using mobile please switch to portrait view and reload this page.");
    }
}

function render() {
    cursor("default"); // gets overriden, placed to avoid carry-over glitches
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,width,height);
    if (paused) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#FFF";
        ctx.fillText("Paused", width / 2, height / 2);
    } else {
        count.currentLevel === 0 ? menu() : gameScript();
    }
    requestAnimationFrame(render);
}

function menu() {
    let dcBlock = {
        x: width * 0.5,
        y: height * 0.45,
        w: width * 0.4,
        h: height * 0.238,
        selected: false
    };
    let djBlock = {
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
    ctx.fillRect(djBlock.x - djBlock.w / 2, djBlock.y  - djBlock.h / 2, djBlock.w, djBlock.h);
    ctx.fillStyle = "#ffe827";
    ctx.font = "30px manaspace";
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE YOUR DAVID", width * 0.5, height * 0.2);
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
    let objects = [stars, bullets, booms, items, enemies, [shop, p1]];
    for (let i = 0; i < objects.length; i++) {
        for (let j = objects[i].length - 1; j >= 0; j--) {
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
    ctx.font = "18px manaspace";
    ctx.textAlign="left";
    ctx.fillText("Davcoin: " + p1.score, 30, height * 0.95);
    ctx.fillText("HP", 30, height * 0.98);
    ctx.fillStyle = "#000000";
    let lifebarWidth = width / 3;
    ctx.fillRect(60, height * 0.96, lifebarWidth, height * 0.02);
    if (p1.hp > 0) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(60, height * 0.96, (p1.hp / p1.maxHp) * lifebarWidth, height * 0.02);
    }
    arsenal();
    // ctx.font = "30px manaspace";
    // ctx.fillText("Mouse Down: " + mouse.down, 30, height * 0.1);
}

function arsenal() {
    let pistolCoords = {
        x: width * 0.59,
        y: height * 0.96,
        w: width * 0.12,
        h: height * 0.065
    };
    let uziCoords = {
        x: width * 0.72,
        y: height * 0.96,
        w: width * 0.12,
        h: height * 0.065
    };
    let rocketCoords = {
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
    for (let j = 0; j < magnitude; j++) {
        let rndX = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
        let rndY = Math.floor(Math.random() * (width * 0.5)) - width * 0.25;
        setTimeout(() => {
            booms.push(new Boom(x + rndX, y + rndY));
        }, Math.floor(Math.random() * time));
    }
}

let pressOptions = {
    event: 'press',
    // pointer: 1,
    threshold: 1,
    time: 1
};

hammertime.get('press').set(pressOptions);

// hammertime.on('touchstart', function(ev) {
//     mouse.down = true;
// });
//
// hammertime.on('touchend', function(ev) {
//
//     mouse.down = false;
// });
//
// hammertime.on('press', function(ev) {
//     alert("press");
//     mouse.down = true;
// });
//
// hammertime.on('pressup', function(ev) {
//     alert("pressup");
//     mouse.down = false;
// });

// body.touchstart(function(e) {
//     handleMouse(e);
//     mouse.down = true;
// });
//
// body.touchend(function(e) {
//     handleMouse(e)
//     mouse.down = false;
// });

// body.mousemove(function(e) {
//     handleMouse(e)
// });

hammertime.on('pan', function(ev) {
    mouse.x = ev.srcEvent.pageX - gc.offset().left;
    mouse.y = ev.srcEvent.pageY - gc.offset().top;
    if (p1.x < 0) p1.x = 0;
    if (p1.x > width) p1.x = width;
});

document.body.addEventListener("click", () => {
    p1.shoot();
}, false);

document.body.addEventListener("mousemove", (e) => {
    handleMouse(e);
}, false);

document.body.addEventListener("mousedown", () => {
    mouse.down = true;
}, false);

document.body.addEventListener("mouseup", () => {
    mouse.down = false;
}, false);

document.body.addEventListener("touchstart", () => {
    mouse.down = true;
}, false);

document.body.addEventListener("touchend", () => {
    mouse.down = false;
}, false);

if (!isMobile) {
    document.addEventListener('keypress', (event) => {
        if (event.keyCode === 112) {
            paused = !paused;
        }
    });
}

// body.mousedown(function(e) {
//     console.log("mousedown");
//     handleMouse(e);
//     mouse.down = true;
//     click();
// });
//
// body.mouseup(function() {
//     console.log("mouseup");
//     mouse.down = false;
// });

init();
render();
