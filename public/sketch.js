var socket = io.connect(window.location.origin);
let playerWon = false;

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

socket.emit('new player', {name: document.getElementById('name').value});
setInterval(function() {
    socket.emit('movement', movement);

}, 1000 / 60);

socket.on('state', function(data) {
    var id = socket.io.engine.id;
    console.log(id);
    const myPlayer = data.players[id];
    if (!playerWon) {
        push();
        translate(myPlayer.xOff, myPlayer.yOff);
        background(0);
        for (var id in data.players) {
            var player = data.players[id];
            fill(100, 100, 100);
            ellipse(player.x, player.y, player.size, player.size);
        }
        for (var f of data.food) {
            fill(0, 255, 0);
            ellipse(f.x, f.y, 10, 10);
        }
        pop();
    }
});

socket.on('victory', function(data) {
    playerWon = true;
    setTimeout(function() {
        playerWon = false;
    }, 5000);
    background(0);
    fill(0, 255, 0);
    textSize(42);
    text('Player ' + data.name + ' won!', 400, 400);
});

function setup() {
    createCanvas(1000, 800);
}

function draw() {
}
