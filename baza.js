const { add } = require('@tweenjs/tween.js');
const Datastore = require('nedb')

module.exports = class baza{



users = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

pionki = new Datastore({
    filename: 'koloryPionkow.db',
    autoload: true
});

constructor (){
   console.log(this.kolor())
}

save(doc){
     this.users.insert(doc, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: "+newDoc._id)
    });
}



kolor(){
    coll1.find({ }, function (err, docs) {
        //zwracam dane w postaci JSON
        console.log("----- tablica obiektów pobrana z bazy: \n")
        console.log(docs)
        console.log("----- sformatowany z wcięciami obiekt JSON: \n")
        console.log(JSON.stringify({ "docsy": docs }, null, 5))
        return(dosc);
    });
}

}

