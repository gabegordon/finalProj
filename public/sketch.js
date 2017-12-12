var socket = io.connect(window.location.origin);
let playerWon = false;
let images = [];
let food;
let bg;

function preload() {
    char0 = loadImage('char0.png');
    char1 = loadImage('char1.png');
    char2 = loadImage('char2.png');
    char3 = loadImage('char3.png');
    food = loadImage('food.png');
    images.push(char0);
    images.push(char1);
    images.push(char2);
    images.push(char3);
    bg = loadImage('background.jpg');
}

function setup() {
    createCanvas(800, 800);
    document.querySelector('.defaultCanvas0').classList.add('hid');
}

function draw() {
}


const button = document.querySelector('button');
button.addEventListener('click', () => {
	socket.emit('new player', {name: document.querySelector('#name').value, image: getImage()});
    document.querySelector('canvas').classList.remove('p5_hidden');
    document.querySelector('canvas').style.visibility = 'visible';
    document.querySelector('button').style.display = 'none';
    document.querySelector('input').style.display = 'none';
});


var movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
    case 65: // A
        movement.left = true;
        break;
    case 87: // W
        movement.up = true;
        break;
    case 68: // D
        movement.right = true;
        break;
    case 83: // S
        movement.down = true;
        break;
    }
});
document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
    case 65: // A
        movement.left = false;
        break;
    case 87: // W
        movement.up = false;
        break;
    case 68: // D
        movement.right = false;
        break;
    case 83: // S
        movement.down = false;
        break;
    }
});

function getImage() {
    return Math.floor(Math.random()* 4);
}

setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

socket.on('state', function(data) {
    var id1 = socket.io.engine.id;
    const myPlayer = data.players[id1];
    if (!playerWon && myPlayer) {
        push();
        imageMode(CORNER);
        background(bg);
        translate(myPlayer.xOff, myPlayer.yOff);
        fill(100, 100, 100);
        imageMode(CENTER);
        for (var id in data.players) {
            var player = data.players[id];
            image(images[player.image], player.x, player.y, player.size, player.size);
        }
        for (var f of data.food) {
            fill(0, 255, 0);
            if (dist(myPlayer.x, myPlayer.y, f.x, f.y) < 400) {
                image(food, f.x, f.y, 50, 50);
            }
        }
        pop();
    }
});

socket.on('victory', function(data) {
    playerWon = true;
    setTimeout(function() {
        playerWon = false;
    }, 5000);
    imageMode(CORNER);
    background(bg);
    fill(0, 255, 0);
    textSize(42);
    text(data.name + ' won!', 250, 400);
});
