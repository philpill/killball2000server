var mongoose = require('mongoose');
var config = require('./config');

var dbconfig = config.database;

var username = dbconfig.user;
var password = dbconfig.pass;
var url = dbconfig.url;
var port = dbconfig.port;
var db = dbconfig.db;

var uri = "mongodb://" + username + ":" + password + "@" + url + ":" + port + "/" + db;

mongoose.connect(uri);

var connection = mongoose.createConnection(uri);

connection.on("open", function(){
    console.log("Connection opened to mongodb at %s", uri);
});

connection.on("error", function(){
    console.log("Mongo connection error");
});

connection.on("connected", function(){
    console.log("Mongo connected");
  });

connection.on("disconnected", function(){
    console.log("Mongo disconnected");
});

connection.on("reconnected", function(){
    console.log("Mongo reconnected");
});

connection.on("error", console.error.bind(console, "connection error:"));