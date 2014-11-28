var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var camera;
// This begins the creation of a function that we will 'call' just after it's built
var createScene = function () {

	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 1, 0);

	//seting the camera
	camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
	camera.noRotationConstraint = true;
	camera.setTarget(BABYLON.Vector3.Zero());


	// This creates a light, aiming 0,1,0 - to the sky.
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .5;

	// Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
	var ground = BABYLON.Mesh.CreateGround("ground1", 12, 12, 2, scene);

	return scene;

}; 

	var scene = createScene();

	//load units
	var units = [new Unit("mesh2", "box", "blue", [0,0,0], [6,0,15], scene),
		 	new Unit("mesh1", "sphere", "yellow", [2,0,4], [6,0,-10], scene)];

engine.runRenderLoop(function () {

	if (Key.isDown(Key.UP)) camera.cameraDirection.z += cameraSpeed;
	if (Key.isDown(Key.LEFT)) camera.cameraDirection.x -= cameraSpeed;
	if (Key.isDown(Key.DOWN)) camera.cameraDirection.z -= cameraSpeed;
	if (Key.isDown(Key.RIGHT)) camera.cameraDirection.x += cameraSpeed;

	if (Key.isDown(Key.LROTATE)) camera.rotation.y += Math.PI*0.01;
	if (Key.isDown(Key.RROTATE)) camera.rotation.y -= Math.PI*0.01;


	checkMovement();

	scene.render();

});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});

var pickedUnit = null;

//When pointer down event is raised
scene.onPointerDown = function (evt, pickResult) {
    // if the click hits the ground object, we change the impact position
    if (pickResult.hit) {

    	if(pickResult.pickedMesh.name == "mesh1" || pickResult.pickedMesh.name == "mesh2" ){
    		pickedUnit = pickResult.pickedMesh;
    		console.log("the unit "+pickedUnit.name +" has been picked");
    	}
    	else if(pickResult.pickedMesh.name == "ground1" && pickedUnit != null){

    		var position = pickedUnit.position;
    		var destiny = pickResult.pickedPoint;
    		console.log("the unit "+pickedUnit.name +" has sent from "+position+" to "+destiny);
    		var message = JSON.stringify(new Unit2(position, destiny));
    		console.log("message=" + message);

			pomelo.request("chat.chatHandler.send", {
				rid: util.rid,
				content: message,
				from: util.username,
				target: "*"
			}, function(data) {
				$("#entry").attr("value", "");
				$("#chatHistory").show();
			});

    	}
    }
};

function checkMovement() {
	var arrayLength = units.length;
	for (var i = 0; i < arrayLength; i++) {
		if (units[i].destiny != null) {
			if (BABYLON.Vector3.Distance(units[i].mesh.position, units[i].destiny) > 0.1) {
				var dir = units[i].destiny.subtract(units[i].mesh.position).normalize();
				units[i].mesh.position = units[i].mesh.position.add(dir.multiplyByFloats(0.1,0.1,0.1));
			}
		}
	}

}


	pomelo.on('onChat', function(data) {
        console.log("received data = " + data.msg);
		$("#chatHistory").show();
		var message = JSON.parse(data.msg);

		units[0].position = new BABYLON.Vector3(message.position.x, message.position.y, message.position.z);
		units[0].destiny = new BABYLON.Vector3(message.destiny.x, message.destiny.y, message.destiny.z);
	});
