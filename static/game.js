
console.log("GAME");

class Game {

    constructor() {
        this.szachownica = [

            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
         
        ];

        this.pionki = [

            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
         
        ];


        // this.pionki = [
        //     [2, 2, 2, 2, 2, 2, 2, 2],
        //     [2, 0, 2, 0, 2, 0, 2, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 1, 0, 1, 0, 1, 0, 1],
        //     [1, 0, 1, 0, 1, 0, 1, 0],
        // ];

    }
    init = id => {
        this.waiting = false;
        this.lost = false;
        this.player = id - 1

        this.scene = new THREE.Scene();
        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 140, 0);
        //else this.camera.position.set(0, 80, -80);
        this.camera.lookAt(this.scene.position);
        this.camera.rotation.z = 90 * Math.PI/180
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff);

        document.getElementById("root").append(this.renderer.domElement);
        document.getElementById("root").addEventListener("mousemove", this.mousemove.bind(this));
        document.getElementById("root").addEventListener("click", this.mouseclick.bind(this));
        this.render() // wywołanie metody render
        this.plansza()
        if(id == 2) net.sendMove("");
        else  ui.startTimer("Czas na ruch ")

        //tworzenie kursora na gorze
        console.log("stworz kursor")
        this.geometry = new THREE.CylinderGeometry(3, 3, 1, 10);
                    this.material1 = new THREE.MeshBasicMaterial({
                        color: 0xff0000
                    });
                    this.material2 = new THREE.MeshBasicMaterial({
                        color: 0x0000ff 
                    });
                if(this.player == 0){
                    this.twojMaterial = this.material1
                    this.materialPrzeciwnika = this.material2
                }

                else{
                    this.twojMaterial = this.material2
                    this.materialPrzeciwnika = this.material1
                }
                this.kursor = new THREE.Mesh(this.geometry, this.twojMaterial);
                   
                    this.kursor.position.set(- 28, 2,- 28)
                    this.kursor.name = "czerwony";
                    this.scene.add(this.kursor);
       // document.getElementById("loguj").addEventListener("click", this.pionki_plansza);

    }

    polozpionek = (nrKolumny, twojPionek) => {
        console.log("xd", nrKolumny, twojPionek)
        for(let i = 0; i < this.szachownica.length; i++){
            if(i+1 >= this.szachownica.length || this.pionki[i+1][nrKolumny] == 1){
                this.pionki[i][nrKolumny] = 1
                let geometry = new THREE.CylinderGeometry(3, 3, 1, 10);
                let material = twojPionek ? this.twojMaterial : this.materialPrzeciwnika;
                this.kula1 = new THREE.Mesh(geometry, material);
                this.kula1.position.set(i * 8 -28, 5, -(nrKolumny * 8 - 27.5) )
                this.kula1.name = "czerwony";
                this.scene.add(this.kula1)
                console.log(this.kula1.position)

                return true;
            }
        }
        return false
    }

    mouseclick = (e) => {
        if(this.select != null && !this.waiting ){
   
           if( this.polozpionek(this.select, true)){
            net.sendMove(this.select)
        }
            console.log(this.pionki);
        }
    }

    mousemove = (e) => {
        this.select = null;
        //console.log(this.player, this.lost, this.waiting)
        if(this.player == undefined || this.lost || this.waiting) return false
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            let obj = intersects.find(a => a.object.name != "")?.object;
            if(obj != null){
                this.select = obj.name[1];
                this.kursor.position.set(-35, 2, (this.szachownica[0].length - this.select - 1) * 8 - 20);
            } 
        }
        return false;
    }

    raycast = e => {
        console.log(this.player, this.lost, this.waiting)
        if(this.player == undefined || this.lost || this.waiting) return false
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        console.log("?")
        if (intersects.length > 0) {
            let obj = intersects[0].object; 
            return this.chooseObject(obj);
        }
        return false;
    }
    chooseObject = obj => {
        console.log(obj, this.player)
        this.clear()

        if (obj.position.y == 2 && ((obj.name.slice(0, obj.name.length - 1) == "czerwony" && this.player) || ((obj.name.slice(0, obj.name.length - 1) == "niebieski" && !this.player)))) {
            this.colorPiece(obj);
        }
        if(obj.position.y == 0 && this.currentPiece){
            let x = this.currentPiece.position.x;
            let y = this.currentPiece.position.y;
            let z = this.currentPiece.position.z;
            if(this.changeColors(obj.position)) return {start: {x, y, z}, end: obj.position};
        }
    }
    colorPiece = (piece) => {
        if (this.currentPiece && this.currentPiece != piece){
            this.currentPiece.material.color = (this.currentPiece.name.slice(0, this.currentPiece.name.length - 1) == "czerwony") ? new THREE.Color(0xff0000) : new THREE.Color(0x0066ff);
            this.currentPiece = null;
        }
        let color = piece.name.slice(0, piece.name.length - 1)
        this.currentPiece = piece;
        piece.material.color = (color == "czerwony") ? new THREE.Color(0xaa0000) : new THREE.Color(0x0033bb);
        if(color == "czerwony"){
        console.log(color)

            this.showAvaiable([[piece.position.x -8, piece.position.z - 8 ], [piece.position.x + 8, piece.position.z - 8 ]])
        }else{
            this.showAvaiable([[piece.position.x -8, piece.position.z + 8 ], [piece.position.x + 8, piece.position.z + 8 ]])
        }
    }
    movePiece = (start, end) => {
        console.log(start, end)
        let x = end.x
        let z = end.z
        let pionek = this.scene.children.find(e => e.position.x == start.x && e.position.y == start.y && e.position.z == start.z )
        try{
            new TWEEN.Tween(pionek.position)
            .to({x, z}, 500)
            .easing(TWEEN.Easing.Elastic.Out)
            .start()
        }catch{
            
        }
        this.pionki[(start.z + 28) / 8][(start.x + 28) / 8] = 0;
        this.pionki[(z + 28) / 8][(x + 28) / 8] = this.player + 1;
        return true;
    }
    
    changeColors(position){
        this.currentPiece.material.color = (this.currentPiece.name.slice(0, this.currentPiece.name.length - 1) == "czerwony") ? new THREE.Color(0xff0000) : new THREE.Color(0x0066ff);
        if(this.check(position)) return false;
        let pozycja_pionka = {...this.currentPiece.position}

        return this.movePiece(pozycja_pionka, position)
    }
    check(position){
        console.log(position)
        console.table(this.toShow)
        if(this.toShow)
            if(!this.toShow.find( e => e.position.z == position.z  && e.position.x == position.x)) return true;
        if(this.pionki[(position.z + 28) / 8][(position.x + 28) / 8]) return true;
        if(this.szachownica[(position.z + 28) / 8][(position.x + 28) / 8]) return true;
        if(this.player && position.z >= this.currentPiece.position.z || !this.player && position.z <= this.currentPiece.position.z) return true;
        //if(this.currentPiece - )
    }
    checkIfLost(){
        if(this.waiting) return
        this.lost = true;
        clearInterval(ui.interval)
        net.lost();
        window.alert("Skończył ci się czas przegrałeś")
    }

    showAvaiable(array){
        console.log(array)
        this.toShow = null

        let toShow = []
        array.forEach(f => {
            if(f[0] > 28 || f[0] < -28 || f[1] > 28 || f[1] < -28 ) {}
            else
            if(!this.check({x: f[0], z: f[1]}))
            toShow.push(this.scene.children.find(e => e.position.x == f[0] && e.position.y == 0 && e.position.z == f[1] ))
        })
        console.log(toShow)
        toShow.forEach(e => {
            e.material.color = new THREE.Color(0xff0000)
        })
        this.toShow = toShow
    }
    clear(){
        if(this.toShow)
        this.toShow.forEach(e => {
            e.material.color = new THREE.Color(0x333333)
        })
    }
    plansza = () => {
        for (let i = 0; i < this.szachownica.length; i++) {
            for (let j = 0; j < this.szachownica[i].length; j++) {
                if (this.szachownica[i][j] == 1) {
                    this.geometry = new THREE.CubeGeometry(8, 2, 8);
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide, // dwustronny
                        map: new THREE.TextureLoader().load('mats/floor.png') , // plik tekstury
                        wireframe: false, 
                        transparent: false, // przezroczysty / nie
                        opacity: 1, // stopień przezroczystości
                        color: 0xffffff  
                    });
                    this.cube = new THREE.Mesh(this.geometry, this.material);
                    this.cube.name = i + "" + j
                    // this.cube.rotation(10)
                    this.cube.position.set(i * 8 - 28, 0, (this.szachownica[i].length - j) * 8 - 28)
                    this.scene.add(this.cube);
                }
                else {
                    this.geometry = new THREE.CubeGeometry(8, 2, 8);
                    this.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide, // dwustronny
                        map: new THREE.TextureLoader().load('mats/floor.png') , // plik tekstury
                        wireframe: false, 
                        transparent: false, // przezroczysty / nie
                        opacity: 1, // stopień przezroczystości
                        color: 0x333333 
                    });
                    this.cube = new THREE.Mesh(this.geometry, this.material);
                    // this.cube.rotation(10)
                    this.cube.position.set(i * 8 - 28, 0, j * 8 - 28)
                    this.scene.add(this.cube);

                }





            }
        }



    }


    pionki_plansza = () => {

        for (let i = 0; i < this.pionki.length; i++) {
            for (let j = 0; j < this.pionki[i].length; j++) {
                if (this.pionki[i][j] == 1) {

                    this.geometry = new THREE.CylinderGeometry(3, 3, 1, 10);
                    this.material = new THREE.MeshBasicMaterial({
                        color: 0xff0000
                    });
                    this.cylinder = new THREE.Mesh(this.geometry, this.material);
                    this.cylinder.position.set(j * 8 - 28, 2, i * 8 - 28)
                    this.cylinder.name = "czerwony" + i;
                    this.scene.add(this.cylinder);
                }
                else if (this.pionki[i][j] == 2) {
                    this.geometry = new THREE.CylinderGeometry(3, 3, 1, 10);
                    this.material = new THREE.MeshBasicMaterial({
                        color: 0x0066ff

                    });
                    this.cylinder = new THREE.Mesh(this.geometry, this.material);
                    this.cylinder.position.set(j * 8 - 28, 2, i * 8 - 28)
                    this.cylinder.name = "niebieski" + i;
                    this.scene.add(this.cylinder);


                }
            }
        }
    }


    render = () => {
        requestAnimationFrame(this.render);
        TWEEN.update();

        this.renderer.render(this.scene, this.camera);
        //console.log("render leci")
    }
}