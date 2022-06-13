
let game;
let net;
let ui;
window.onload = () => {
    game = new Game();
    net = new Net();
    ui = new UI();

    window.addEventListener("click", e => {
        let position = game.raycast(e);
        if(position) {
            net.sendMove(position)
        } 
    });
}