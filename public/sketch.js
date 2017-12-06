var socket = io.connect(window.location.origin);

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



socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);

}, 1000 / 60);

socket.on('state', function(data) {
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
});

socket.on('victory', function(data) {
    background(0);
    textMode(CENTER);
    text('Player __ won', 400, 400);
});

function setup() {
    createCanvas(1000, 800);
}

function draw() {
}
