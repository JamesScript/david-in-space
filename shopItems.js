function ShopItem(name) {
    this.name = name;
    this.expended = false;
    this.itemVar = {
        "beer": [img.beer, 100, () => {p1.hp += 10}],
        "firstAid": [img.firstAid, 250, () => {p1.hp += 25}],
        "barrier": [img.barrier, 1000, () => {p1.barrier += 1}],
        "uziAmmo": [img.uziAmmo, 800, () => {p1.uziAmmo += 300}],
        "rocket": [img.rocketAmmo, 2000, () => {p1.rocketAmmo += 5}]
    };
    this.display = (x, y) => {
        let sq = {
            w: width * 0.18,
            h: height * 0.13
        };
        ctx.fillStyle = "#005cb7";
        ctx.fillRect(x, y, sq.w, sq.h);
        ctx.drawImage(this.itemVar[this.name][0], x + 2, y, sq.w, sq.h);
        ctx.font = font(15);
        ctx.fillStyle = "#FFF";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(x + width * 0.045, y + width * 0.14, width * 0.09, width * 0.04);
        ctx.globalAlpha = 1;
        let collisionObject = {
            x: x + (sq.w / 2),
            y: y + (sq.h / 2),
            w: sq.w,
            h: sq.h
        };
        if (collision(collisionObject, mouse)) {
            ctx.fillStyle = "#FFFF00";
            cursor("pointer");
            shop.insufficientFunds = false;
            if (mouse.down && !shop.purchaseSpamTimeOutSet) {
                if (p1.score < this.itemVar[this.name][1]) {
                    shop.insufficientFunds = true;
                } else {
                    p1.score -= this.itemVar[this.name][1];
                    p1.totalSpent += this.itemVar[this.name][1];
                    shop.purchaseSpamTimeOutSet = true;
                    this.itemVar[this.name][2]();
                    this.expended = true;
                    setTimeout(() => { shop.purchaseSpamTimeOutSet = false }, 500);
                }
            }
        } else {
            ctx.fillStyle = "#FFF";
        }
        ctx.fillText(this.itemVar[this.name][1], x + width * 0.09, y + width * 0.18);
    };
}