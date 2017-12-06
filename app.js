var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(process.env.PORT || 3000);

app.use(express.static('public'));

var players = {};
var food = [];

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * 1000);
        this.y = Math.floor(Math.random() * 800);
    }
}

for (let i = 0; i < 50; i++) {
    food.push(new Food());
}

io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 800),
            size: 30
        };
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
        for (var player in players) {
            if (players[player].size > 400) {
                socket.emit('victory', players[player]);
                for (const p in players) {
                    players[p].x = 300;
                    players[p].y = 300;
                    players[p].size = 30;
                }
                break;
            }
            for (let f = 0; f < food.length; f++) {
                if (Math.hypot(food[f].x - players[player].x, food[f].y - players[player].y) <= players[player].size / 2) {
                     players[player].size += 10;
                     food.splice(f, 1);
                     food.push(new Food());
                }
            }
            for (var player2 in players) {
                if (Math.hypot(players[player2].x - players[player2].x, players[player2].y - players[player].y) <= (players[player].size / 2)) {
                    if (players[player].size > players[player2].size) {
                        players[player].size += players[player2].size;
                        players[player2].x = Math.floor(Math.random() * 1000);
                        players[player2].y = Math.floor(Math.random() * 800);
                        players[player2].size = 30;
                    }
                    else if (players[player].size < players[player2].size){
                        players[player2].size += players[player].size;
                        players[player].x = Math.floor(Math.random() * 1000);
                        players[player].y = Math.floor(Math.random() * 800);
                        players[player].size = 30;
                    }
                }
            }
        }
    });
});


io.on('connection', function(socket) {
    socket.on('disconnect', function() {
        delete players[socket.id];
    });
});

setInterval(function() {
    io.sockets.emit('state', {players: players, food: food});
}, 1000 / 60);
