var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


