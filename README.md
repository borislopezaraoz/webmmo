Simple MMO (massively multiplayer online) using pomelo.netease.com for backend and www.babylonjs.com for WebGL.

Requisites:

1. Install Node.js
2. Install Pomelo: https://github.com/NetEase/pomelo/wiki/Installation


Instructions:

- Replace your host name in: (need to fix this)

game-server/config/servers.json
game-server/config/master.json

- Run npm-install.sh or npm-install.bat. This will install all required Node packages.

- Start the game server:

cd game-server
pomelo start

- Start the web server:

cd web-server
node app.js

- Login to http://<your host name>:3001/game.html from different tabs/windows/browsers/computers

- Play around moving the units



Current issues:

Position of units is initially center is not synchronized until the unit moves.

The server should assign initial position and broadcast.

Handle logout event.
