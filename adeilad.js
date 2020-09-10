const gameScreen = document.getElementById("gameScreen");
const ctx = gameScreen.getContext("2d");

const stopButton = document.getElementById("stop");

//#region $Audio
const backgroundAudio = new Audio("audio/background.mp3");
const clickAudio = new Audio("audio/Ting.mp3");
const loseAudio = new Audio("audio/Lose.mp3");
//#endregion

//#region $Image
const brickImage = new Image();
brickImage.src =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQnYt57bDBdKzeJGoN2PMABWdpxfOX8SEI_eg&usqp=CAU";
//#endregion

let time, gameOn, click, size, allBild, score, lose, myBestScore;

const screen = {
    w: gameScreen.width,
    h: gameScreen.height,
};

const speed = {
    global: 1,
    bild: 2,
};

const move = {
    bild: 2,
};

class Size {
    constructor(bild$w, bild$h, startButton$w, startButton$h) {
        this.bild$w = bild$w;
        this.bild$h = bild$h;
        this.startButton$w = startButton$w;
        this.startButton$h = startButton$h;
    }
}

class bild {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lastTime = time;
    }

    draw() {
        ctx.drawImage(brickImage, this.x, this.y, this.w, this.h)
    }

    updateLocation() {
        if (time - this.lastTime > speed.bild) {
            if (this.x < 0 || this.x > screen.w - this.w) {
                move.bild = move.bild * -1;
            }
            this.x += move.bild;
            this.lastTime = time;
        }
    }
}
window.onload = setUpStart();
function setUpStart() {
    size = new Size(150, 40, 170, 90);
    drawStartButton();
    clickStart();
}

function drawStartButton() {
    ctx.fillStyle = "green";
    ctx.fillRect(
        screen.w / 2 - size.startButton$w / 2,
        screen.h / 2 - size.startButton$h / 2,
        size.startButton$w,
        size.startButton$h
    );
    ctx.fillStyle = "rgb(100, 70, 30)";
    ctx.font = "50px Saira Stencil One, cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("start!", screen.w / 2, screen.h / 2);
}

function clickStart() {
    document.addEventListener("click", (event) => {
        let xClick = event.pageX - gameScreen.offsetLeft;
        let yClick = event.pageY - gameScreen.offsetTop;
        if (
            xClick < screen.w / 2 + size.startButton$w &&
            xClick > screen.w / 2 - size.startButton$w &&
            yClick < screen.h / 2 + size.startButton$h &&
            yClick > screen.h / 2 - size.startButton$h &&
            (gameOn === false || gameOn === undefined)
        ) {
            ctx.clearRect(0, 0, screen.w, screen.h);
            setUpGame();
        }
    });
}

function setUpGame() {
    setUpVariables();
    clickStop();
    mainLoop();
}

function setUpVariables() {
    allBild = [];
    time = 0;
    score = 0;
    lose = false;
    move.bild = 2;
    myBild = new bild(
        screen.w / 2 - size.bild$w / 2,
        screen.h - size.bild$h,
        size.bild$w,
        size.bild$h
    );
    myBestScore = localStorage.getItem(
        "#@@#$%$my.best.score.adeilad.code=6374148"
    );
}

function clickStop() {
    stopButton.addEventListener("click", (event) => {
        clickAudio.volume = 0.1;
        clickAudio.play();
        click = true;
    });
}

function mainLoop() {
    backgroundAudio.volume = 0.05;
    backgroundAudio.play();

    updateBildLocation();
    if (click) {
        setBild();
        if (!lose) {
            setNewBild();
            score++;
        }
        click = false;
    }
    clearscreen();
    draw();

    gameOn = !checkLose();
    time++;
    if (gameOn) {
        setTimeout(mainLoop, speed.global);
    } else {
        endGame();
    }
}

function updateBildLocation() {
    myBild.updateLocation();
}

function setBild() {
    if (allBild.length === 0) {
        allBild.push(myBild);
    } else {
        let bildX = { locetion: null, len: 0, in: false };
        let lastBild = allBild[allBild.length - 1];
        for (
            let myBildIndex = myBild.x;
            myBildIndex < myBild.x + myBild.w;
            myBildIndex++
        ) {
            for (
                let lastBildIndex = lastBild.x;
                lastBildIndex < lastBild.x + lastBild.w;
                lastBildIndex++
            ) {
                if (myBildIndex === lastBildIndex) {
                    if (bildX.in === false) {
                        bildX.locetion = myBildIndex;
                        bildX.in = true;
                    }
                    bildX.len++;
                }
            }
        }
        if (bildX.in === true) {
            allBild.push(
                new bild(bildX.locetion, myBild.y, bildX.len, size.bild$h)
            );
        } else {
            lose = true;
        }
    }
}

function setNewBild() {
    let lastBild = allBild[allBild.length - 1];
    myBild = new bild(
        lastBild.x,
        lastBild.y - (size.bild$h + 1),
        lastBild.w,
        size.bild$h
    );
}

function clearscreen() {
    if (myBild.y < 0) {
        let len = allBild.length - 7;
        for (let index = 0; index < len; index++) {
            allBild.shift();
        }
        myBild.y = screen.h - (size.bild$h * 7 + 7);
        for (let indexBild = 0; indexBild < 7; indexBild++) {
            allBild[indexBild].y =
                screen.h - (size.bild$h * indexBild + indexBild);
        }
    }
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, screen.w, screen.h);

    ctx.fillStyle = "green";
    ctx.font = "100px Saira Stencil One, cursive";
    ctx.fillText(score, screen.w / 2, 55);

    ctx.fillStyle = "green";
    ctx.font = "20px Saira Stencil One, cursive";
    ctx.fillText(`best score: ${myBestScore}`, 80, 15);

    myBild.draw();

    allBild.forEach((oneBild) => {
        oneBild.draw();
    });
}

function checkLose() {
    if (lose) {
        return true;
    } else {
        return false;
    }
}

function endGame() {
    loseAudio.play();

    bestScore();
    setUpStart();
}

function bestScore() {
    if (!myBestScore) {
        localStorage.setItem(
            "#@@#$%$my.best.score.adeilad.code=6374148",
            score
        );
    } else {
        myBestScore = parseInt(myBestScore);
        if (score > myBestScore) {
            localStorage.setItem(
                "#@@#$%$my.best.score.adeilad.code=6374148",
                score
            );
        }
    }
}
