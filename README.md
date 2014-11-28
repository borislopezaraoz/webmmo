Simple MMO (massively multiplayer online) using pomelo.netease.com for backend and www.babylonjs.com for WebGL.

Requisites:

Install Node.js

Instructions:

1. Replace your host name in:

game-server/config/servers.json
game-server/config/master.json

2. Run npm-install.sh or npm-install.bat. This will install all required Node packakes.
3. Start the game server:

cd game-server
pomelo start

4. Start the web server:

cd web-server
node app.js

5. Goto: http://<your host name>:3001/juego2.html
