function Unit (id, figure, color, position, destiny, scene) {

	switch(figure) {
    case 'sphere':
        this.mesh = BABYLON.Mesh.CreateSphere(id, 9, 2, scene);
        break;
    case 'box':
        this.mesh = BABYLON.Mesh.CreateBox(id, 2, scene);
        break;
    case 'cylinder':
    	this.mesh = BABYLON.Mesh.CreateCylinder(id,  3, 3, 3, 6, 1, scene);
    	break;
	}

	var material = new BABYLON.StandardMaterial("mat", scene);

	switch(color) {
    case 'red':
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        break;
    case 'yellow':
        material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        break;
    case 'blue':
    	material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    	break;
	}

	this.mesh.material = material;

	this.position = new BABYLON.Vector3(position[0],position[1],position[2]);
	if(destiny != null){
		this.destiny = new BABYLON.Vector3(destiny[0],destiny[1],destiny[2]);
	}

}


function Unit2 (position, destiny) {
    this.position = position;
    this.destiny = destiny;
}
