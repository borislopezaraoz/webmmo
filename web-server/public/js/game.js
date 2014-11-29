var game = {
	scene : null,
	engine : null,
	camera : null,
	pickedUnit : null,
	units : null,
	init : function(users) {
		game.engine = new BABYLON.Engine(document.getElementById("renderCanvas"), true);
		game.scene = game.createScene();
		game.camera = game.createCamera();
		game.createUnits(users);
		game.engine.runRenderLoop(game.runRenderLoop);
		window.addEventListener("resize", function () {
			game.engine.resize();
		});

		//When pointer down event is raised
		game.scene.onPointerDown = function (evt, pickResult) {
			console.log(pickResult.pickedMesh.name);
		    // if the click hits the ground object, we change the impact position
		    if (pickResult.hit) {
		    	if (pickResult.pickedMesh.name == username) {
		    		game.pickedUnit = pickResult.pickedMesh;
		    		console.log("the unit " + game.pickedUnit.name + " has been picked");
		    	} else if (pickResult.pickedMesh.name == "ground1" && game.pickedUnit != null) {
		    		var position = game.pickedUnit.position;
		    		var destiny = pickResult.pickedPoint;
		    		console.log("the unit " + game.pickedUnit.name + " has been sent from " + position + " to " + destiny);
		    		var message = JSON.stringify(new Unit2(position, destiny));
		    		console.log("message=" + message);

					pomelo.request("chat.chatHandler.send", {
						rid: util.rid,
						content: message,
						from: username,
						target: "*"
					}, function(data) {
						$("#entry").attr("value", "");
						$("#chatHistory").show();
					});
		    	}
		    }
		};

		pomelo.on('onChat', function(data) {
		    console.log("received data = " + data.msg);
			$("#chatHistory").show();
			var message = JSON.parse(data.msg);
			var unit = game.units[data.from];
			if (unit) {
				unit.position = new BABYLON.Vector3(message.position.x, message.position.y, message.position.z);
				unit.destiny = new BABYLON.Vector3(message.destiny.x, message.destiny.y, message.destiny.z);
			}
		});

		pomelo.on('onAdd', function(data) {
			game.addUnit(data.user);
		});

		pomelo.on('onLeave', function(data) {
			game.removeUnit(data.user);
		});

	},
	createCamera : function() {
		game.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), game.scene);
		game.camera.noRotationConstraint = true;
		game.camera.setTarget(BABYLON.Vector3.Zero());
		return game.camera;
	},
	createScene : function() {
		var scene = new BABYLON.Scene(game.engine);
		scene.clearColor = new BABYLON.Color3(0, 1, 0);
		// this creates a light, aiming 0,1,0 - to the sky
		var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		light.intensity = .5;
		// let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
		var ground = BABYLON.Mesh.CreateGround("ground1", 12, 12, 2, scene);
		return scene;
	},
	createUnits : function(users) {
		game.units = {};
		for (var i = 0; i < users.length; i++) {
			console.log(users[i]);
			game.units[users[i]] = new Unit(users[i], "sphere", "blue", [0, 0, 0], [i * 2, 0, i * 2], game.scene);
		}
	},
	addUnit : function(user) {
		game.units[user] = new Unit(user, "sphere", "blue", [0, 0, 0], [0, 0, 0], game.scene);
	},
	removeUnit : function(user) {
		delete game.units[user];
	},
	runRenderLoop : function() {
		if (Key.isDown(Key.UP)) game.camera.cameraDirection.z += cameraSpeed;
		if (Key.isDown(Key.LEFT)) game.camera.cameraDirection.x -= cameraSpeed;
		if (Key.isDown(Key.DOWN)) game.camera.cameraDirection.z -= cameraSpeed;
		if (Key.isDown(Key.RIGHT)) game.camera.cameraDirection.x += cameraSpeed;
		if (Key.isDown(Key.LROTATE)) game.camera.rotation.y += Math.PI * 0.01;
		if (Key.isDown(Key.RROTATE)) game.camera.rotation.y -= Math.PI * 0.01;
		game.checkMovement();
		game.scene.render();
	},
	checkMovement : function() {
		for (var user in game.units) {
			var unit = game.units[user];
			if (unit.destiny != null) {
				if (BABYLON.Vector3.Distance(unit.mesh.position, unit.destiny) > 0.1) {
					var dir = unit.destiny.subtract(unit.mesh.position).normalize();
					unit.mesh.position = unit.mesh.position.add(dir.multiplyByFloats(0.1, 0.1, 0.1));
				}
			}
		}
	}
};
