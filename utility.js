let width = window.innerWidth > window.innerHeight ? 411 : window.innerWidth;
let height = window.innerHeight;

function collision(a, b) {
    if (p1.hp <= 0 && a !== mouse && b !== mouse) {
        return false;
    }
    return (
        a.x - a.w / 2 <= b.x + b.w / 2
        && a.x + a.w / 2 >= b.x - b.w / 2
        && a.y - a.h / 2 <= b.y + b.h / 2
        && a.y + a.h / 2 >= b.y - b.h / 2
    )
}

function cursor(type) {
    if (!gc.hasClass(type)) {
        gc.removeClass("default");
        gc.removeClass("pointer");
        gc.addClass(type);
    }
}

function font(size) {
    let fraction = size / 411;
    return (width * fraction).toString() + "px manaspace";
}

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.hasPlayed = false;
    this.tOut = undefined;
    document.body.appendChild(this.sound);
    this.play = () => {
        this.sound.play();
    };
    this.pause = () => {
        this.sound.pause();
    };
    this.stop = () => {
        this.sound.pause();
        this.sound.currentTime = 0;
    };
    this.rewind = () => {
        this.sound.currentTime = 0;
    };
    this.ended = () => {
        return this.sound.ended;
    };
    this.volume = (vol) => {
        this.sound.volume = vol;
    };
    this.cloneComp = (time) => {
        let audio = this.sound.cloneNode(true);
        audio.currentTime = time;
        audio.play();
        setTimeout(() => {
            audio.pause();
        } , 2000)
    };
    this.clone = (time) => {
        if (isMobile) {
            clearTimeout(this.tOut);
            this.sound.currentTime = time;
            this.play();
            this.tOut = setTimeout(() => {
                this.pause();
            } , 2000);
        } else {
            this.cloneComp(time);
        }
    }
}

function mapNums(checkVar, start1, end1, start2, end2) {
    if (checkVar < start1) {
        return start2;
    } else if (checkVar > end1) {
        return end2;
    } else {
        return (checkVar - start1) / (end1 - start1) * (end2 - start2) + start2;
    }
}

function handleMouse(e) {
    mouse.x = Math.round(e.pageX - gc.offset().left);
    mouse.y = Math.round(e.pageY - gc.offset().top);
}

// function click() {
//     p1.shoot();
// }

function checkIfMobile() {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
}