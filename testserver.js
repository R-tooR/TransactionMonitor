var http = require('http');
var logger = require('./logger/logger');
var express = require('express');
var app = express();
app.set('view engine', 'pug');
const monitor = require('./executors/monitor');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const entityBase1 = {
    values : {
        id_klienta: "",
        imie: "",
        nazwisko: "",
        kwota: 0
    },
    idcolumn : "id_klienta"
};

const entityBase3 = {
    values : {
        id_klienta: "",
        imie: "",
        nazwisko: "",
        srodki: ""
    },
    idcolumn : "id_klienta"
};

//coordinator.addDatabase
monitor.addDatabase("base1", {
        connectionLimit : 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'testowabaza',
        port: 3306

    }, 'mysql', entityBase1);

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




let transactionObj  = {
    base1:[],
    base2:[],
    base3:[]
};

let result = "";

app.get('/', function(req, res) {
    res.render('index', {title: "Transaction Monitor Client"});
    res.end();
});
app.get('/base1', function (req, res) {
    res.render('baseform1', {title: "Base 1"});
});

app.post('/base1', function(req, res){
   res.redirect('/base1');
});

app.get('/base3', function (req, res) {
    res.render('baseform3', {title: "Base 3"});
});

app.post('/base3', function(req, res){
    res.redirect('/base3');
});

app.post('/execute', function (req, res) {
    monitor.executeTransaction(transactionObj).then(() => {result=true; console.log("Success")}, () => {result = false; console.log("Fail");});

});

app.get('/execute', function (req, res) {
   res.end(result);
});

app.get('/success',function (req, res) {
    res.end("Transaction succeed. Changes has been applied.");
});

app.get('/fail',function (req, res) {
    res.end("Transaction failed. Changes has been discard.");
});

app.post('/', function (req, res) {
    if(req.body.hasOwnProperty("insert1")){
        const id = (req.body.id_klienta !== "") ? req.body.id_klienta : "DEFAULT";
        transactionObj.base1.push({
            operation : "insert",
            table : "bank1.klienci",
            values : {
                id_klienta : id,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                kwota : req.body.kwota
            },
            idcolumn : entityBase1["idcolumn"]});
    } else if(req.body.hasOwnProperty("update1")){
        transactionObj.base1.push({
            operation : "update",
            table : "bank1.klienci",
            values : {
                id_klienta : req.body.id_klienta,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                kwota : req.body.kwota
            },
            idcolumn : entityBase1["idcolumn"]})
    } else if(req.body.hasOwnProperty("delete1")){
        transactionObj.base1.push({
            operation : "delete",
            table : "bank1.klienci",
            values : {
                id_klienta : req.body.id_klienta,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                kwota : req.body.kwota
            },
            idcolumn : entityBase1["idcolumn"]})
    } else if(req.body.hasOwnProperty("insert3")){
        const id = (req.body.id_klienta !== "") ? req.body.id_klienta : "DEFAULT";
        transactionObj.base3.push({
            operation : "insert",
            table : "klienci",
            values : {
                id_klienta : id,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                srodki : req.body.srodki
            },
            idcolumn : entityBase3["idcolumn"]})
    } else if(req.body.hasOwnProperty("update3")){
        transactionObj.base3.push({
            operation : "update",
            table : "klienci",
            values : {
                id_klienta : req.body.id_klienta,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                srodki : req.body.srodki
            },
            idcolumn : entityBase3["idcolumn"]})
    } else if(req.body.hasOwnProperty("delete3")){
        transactionObj.base3.push({
            operation : "delete",
            table : "klienci",
            values : {
                id_klienta : req.body.id_klienta,
                imie : req.body.imie,
                nazwisko : req.body.nazwisko,
                srodki : req.body.srodki
            },
            idcolumn : entityBase3["idcolumn"]})
    }
    console.log(JSON.stringify(transactionObj));
    res.redirect("/");
    res.end();
});
app.listen(8080);

