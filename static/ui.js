class UI {
constructor(){
    this.login = document.getElementById("loguj")
    this.ui = document.getElementById("log")
    this.reset = document.getElementById("reset")
    this.username = document.getElementById("playerName")
    this.status = document.getElementById("status")
    this.timer = document.getElementById("timer")


    this.login.onclick = () =>{
            net.loginUser()     
    }
    this.reset.onclick = () =>{
        net.reset()
    }
    
}

wait(login){
    this.status.innerHTML = "Waiting for other player..."
    this.interval = setInterval(async () =>{
        let check = await net.checkUsers()
         if(check){
             this.afterLogin(login)
            }
        }
         , 100)
}

afterLogin(login){
    clearInterval(this.interval)
    console.log(login)
    if(login.added){
        this.ui.style.display = "none";
        this.status.innerHTML = `<h1> Witaj ${net.user}</h1>`;
        this.status.innerHTML += `<p> Jesteś graczem ${login.id}</p>`
        game.init(login.id)
    }else { 
        if(login[0]) this.status.innerHTML = `<h1> Maksymalna liczba graczy, nie można zalogować</h1>`;
        else this.status.innerHTML = `<h1>Nazwa użytkownika jest zajęta</h1>`;
    }
}

startTimer(text){
    clearInterval(this.interval);
    this.counter = 30
    this.interval = setInterval(() => {
        this.timer.innerHTML = text + this.counter
        if(this.counter == 0) game.checkIfLost();
        this.counter--;
    }, 1000)
    
}





}