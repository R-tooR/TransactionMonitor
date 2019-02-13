var http = require('http');
var logger = require('./logger/logger');
var express = require('express');
var app = express();
app.set('view engine', 'pug');
const monitor = require('./monitor');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//coordinator.addDatabase
monitor.addDatabase("base1", {
        connectionLimit : 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'testowabaza',
        port: 3306

    }, 'mysql', {
    values : {
        id_klienta: "",
        imie: "",
        nazwisko: "",
        kwota: 0
    },
    idcolumn : "id_klienta"
});

monitor.addDatabase("base2", {
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '$Epultura33',
    database: 'coffeeland',
    port: 3307

}, 'mysql', {
    values: {
        orderId: "",
        workerId: "",
        description: "",
        openDate: "",
        isClosed: ""
    },
    idcolumn: "orderId"
});

monitor.addDatabase("base3", {
    max : 10,
    host: 'localhost',
    user: 'postgres',
    password: '$Epultura33',
    database: 'bank2',
    port: 5432

}, 'postgres', {
    values: {
        id_klienta: "",
        imie: "",
        nazwisko: "",
        srodki: ""
    },
    idcolumn: "id_klienta"
});


/*monitor.addDatabase("base2", {
        connectionLimit : 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ksiazki' //po prostu to jest chyba domyślny schemat

    });*/

const parser = require("./factory/queryparser-mysql");
const objInsert = {
    operation : "insert",
    table : "bank1.klienci",
    values : {
        id_klienta : "DEFAULT",
        imie : "Kuba",
        nazwisko : "Kuba",
        kwota : 230
    },
    idcolumn : "id_klienta"
};

const objUpdateP = {
    operation : "update",
    table : "klienci",
    values : {
        id_klienta : "1",
        imie : "Kuba",
        nazwisko : "Kuba",
        srodki : 230
    },
    idcolumn : "id_klienta"
};

const objInsertP = {
    operation : "insert",
    table : "klienci",
    values : {
        id_klienta : "DEFAULT",
        imie : "Kuba",
        nazwisko : "Łukawiec",
        srodki : 2300
    },
    idcolumn : "id_klienta"
};

const objDeleteP = {
    operation : "delete",
    table : "klienci",
    values : {
        id_klienta : "10",
        imie : "Kuba",
        nazwisko : "Kuba",
        srodki : 230
    },
    idcolumn : "id_klienta"
};

const objInsert3 = {
    operation : "insert",
    table : "coffeeland.complaints",
    values : {
        orderId : 3,
        workerId : 0,
        description : "Opis",
        openDate : "2018-10-23",
        isClosed : "false"
    },
    idcolumn : "orderId"
};

const objUpdate = {
    operation : "update",
    table : "bank1.klienci",
    values : {
        id_klienta : "5",
        imie : "Michał",
        nazwisko : "Anioł",
        kwota : 350
    },
    idcolumn : "id_klienta"
};

const objDelete = {
    operation : "delete",
    table : "bank1.klienci",
    values : {
        id_klienta : "47",
        imie : "Kuba",
        nazwisko : "Kuba",
        kwota : 230
    },
    idcolumn : "id_klienta"
};

app.get('/', function(req, res) {
    //coordinator.executeTransaction({base1: objInsert}, Date.now());
    /*function addToDB(n){
        if(n === 1)
            console.log("1");
        else if (n === 2)
            console.log("2");
        else if(n === 3)
            console.log("3");
        else
            console.log("Problem");
    }*/
    //db.connect().then(obj => {console.log("Połączono");obj.done()}).catch(err => {console.log('ERROR: ', err.message)});
    //db.one("INSERT INTO klienci VALUES(DEFAULT, 'Calvin', 'Harris', 23000) RETURNING id_klienta").then((res) => console.log(res)); //one do pojednynczego pytania - wyrzuca error, jak jest więcej niż jedno..
    //res.render('index', {title: "Transaction Monitor Client"});
    monitor.executeTransaction({base3: {objInsertP,objDeleteP}, base2: {objInsert3}}).then(() => {console.log("Success")}, () => {console.log("Fail")});
    //console.log(parser.parseIntoDeleteQuery(objDelete));
    res.end();
});
app.post('/execute', function (req, res) {
    //console.log(JSON.stringify(req.body));//działa
    monitor.executeTransaction({base1: objInsert, base2: objInsert3}).then(() => {console.log("Success")}, () => {console.log("Fail")});
    res.end();
});
app.listen(8080);

