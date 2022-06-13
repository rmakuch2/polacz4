const { equal } = require("assert");
var express = require("express")
var app = express()
const PORT = 4000;
let userTab=[];
let move;
let lost = false;
app.use(express.static('static'))

app.use(express.text())

app.post("/ADD_USER", (req,res) =>{
    if(userTab.includes(req.body)){
        console.log("Nazwa już istnieje")
        res.send("[0]")
        return
    }
    if(userTab.length<2){
        userTab.push(req.body);
        console.log(userTab)
        res.send(JSON.stringify({id: userTab.length, added:true}))
    }
    else{
        console.log("Za duzo graczy!")
        res.send("[1]")
    }
})

app.get("/move", (req, res) => {
    if(move) {
        console.log(move)
        res.send(move);
        move = null;
    }
    else res.send(JSON.stringify([lost]))
})

app.get("/lost", (req, res) => {
    lost = true;
    res.send("")
})

app.post("/move", (req, res) => {
    move = req.body;
    console.log(req.body)
    res.send("[]")
})

app.get("/reset", (req, res) =>{
    lost = false
    console.log("reset")
    userTab = [];
    res.send("")
})

app.get("/check", (req, res) => {
    if(userTab.length == 2) res.send("[true]")
    else res.send("[false]")
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})