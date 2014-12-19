function Unit (id, figure, color, position, destiny, scene) {

    var that = this;

	switch(figure) {
    case 'sphere':
        this.mesh = BABYLON.Mesh.CreateSphere(id, 9, 2, scene);
        break;
    case 'link':   
        BABYLON.SceneLoader.ImportMesh("", "models/younglink/", "runningLink.babylon", scene, function (newMeshes, skeletons){
            
            newMeshes[0].name = id;
            newMeshes[0].id = id;
            that.mesh = newMeshes[0];
            that.animate('stand');
        });
        break;
    case 'box':
        this.mesh = BABYLON.Mesh.CreateBox(id, 2, scene);
        break;
    case 'cylinder':
    	this.mesh = BABYLON.Mesh.CreateCylinder(id,  3, 3, 3, 6, 1, scene);
    	break;
	}

	this.position = new BABYLON.Vector3(position[0],position[1],position[2]);

	if (destiny != null) {
		this.destiny = new BABYLON.Vector3(destiny[0],destiny[1],destiny[2]);
	}

    this.setMesh = function(mesh) {
        this.mesh = mesh;
    };

    this.animation = "stand"

    this.animate = function(animation) {
        if(this.animation != animation) {
            switch(animation) {
                case 'run':
                    game.scene.beginAnimation(this.mesh.skeleton, 60, 80, true, 1.0);
                    this.animation = 'run';
                    break;
                case 'stand':
                    game.scene.beginAnimation(this.mesh.skeleton, 0, 40, true, 1.0);
                    this.animation = 'stand';
                    break;
            }
        }
    }

}

function Unit2 (position, destiny) {
    this.position = position;
    this.destiny = destiny;
}
