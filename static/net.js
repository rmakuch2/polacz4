
class Net {
    loginUser() {
        this.user = ui.username.value;
        const options = {
            method: "POST",
            body: JSON.stringify(this.user)
        };

        fetch("/ADD_USER", options)
            .then(response => response.text())
            .then(login => ui.wait(JSON.parse(login)))
            .catch(error => console.log(error))
    }

    reset() {
        fetch("/reset").then(response => response.text())
            .then(login => console.log("reset"))
            .catch(error => console.log(error))
    }

    async sendMove(move) {
        game.waiting = true;
        if (move) {
            const options = {
                method: "POST",
                body: JSON.stringify({ nrKolumny: move, player: game.player })

            };
            await fetch("/move", options)
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.log(error))
        }
        ui.startTimer("Oczekiwanie na oponenta ")
        setTimeout(() => {
            this.interval = setInterval(async () => {
                let move = await this.checkMove()
                
                if (move.nrKolumny != null && move.player != game.player) {

                    console.log(game.polozpionek)
                    game.polozpionek(parseInt(move.nrKolumny), false)

                    console.log(move)
                    game.waiting = false
                    clearInterval(this.interval)
                    ui.startTimer("Czas na ruch ")
                }
                if (move[0]) {
                    clearInterval(ui.interval)
                    clearInterval(this.interval)
                    window.alert("Wygrałeś grę")
                }
            }, 100)
        }, 700);
    }

    lost() {
        fetch("/lost")
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }

    async checkMove() {
        let move;
        await fetch("/move")
            .then(response => response.text())
            .then(data => {
                move = JSON.parse(data)
            })
            .catch(error => console.log(error))
        return move
    }

    async checkUsers() {
        let check = false;
        await fetch("/check")
            .then(response => response.text())
            .then(data => check = JSON.parse(data)[0])
            .catch(error => console.log(error))
        return check;
    }
}