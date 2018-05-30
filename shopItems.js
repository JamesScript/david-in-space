function ShopItem(name) {
    this.name = name;
    this.expended = false;
    this.sprite = () => {
        switch(this.name) {
            case "beer":
                return img.beer;
            case "firstAid":
                return img.firstAid;
        }
    };
    this.cost = () => {
        switch(this.name) {
            case "beer":
                return 100;
            case "firstAid":
                return 250;
        }
    };
    this.purchase = () => {
        switch(this.name) {
            case "beer":
                p1.hp += 10;
                break;
            case "firstAid":
                p1.hp += 25;
                break;
        }
    };
    this.display = (x, y) => {
        let sq = width * 0.18;
        ctx.fillStyle = "#005cb7";
        ctx.fillRect(x, y, sq, sq);
        ctx.drawImage(this.sprite(), x + 2, y, sq, sq);
        ctx.font = "15px manaspace";
        ctx.fillStyle = "#FFF";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(x + width * 0.045, y + width * 0.14, width * 0.09, width * 0.04);
        ctx.globalAlpha = 1;
        let collisionObject = {
            x: x + (sq / 2),
            y: y + (sq / 2),
            w: sq,
            h: sq
        };
        if (collision(collisionObject, mouse)) {
            ctx.fillStyle = "#FFFF00";
            cursor("pointer");
            shop.insufficientFunds = false;
            if (mouse.down && !shop.purchaseSpamTimeOutSet) {
                if (p1.score < this.cost()) {
                    shop.insufficientFunds = true;
                } else {
                    p1.score -= this.cost();
                    p1.totalSpent += this.cost();
                    shop.purchaseSpamTimeOutSet = true;
                    this.purchase();
                    this.expended = true;
                    setTimeout(() => { shop.purchaseSpamTimeOutSet = false }, 500);
                }
            }
        } else {
            ctx.fillStyle = "#FFF";
        }
        ctx.fillText(this.cost(), x + width * 0.09, y + width * 0.18);
    };
}