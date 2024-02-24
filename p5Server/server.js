/*
    ~ * ~ * ~ * VARIABLES
    ~ * ~ * ~ * 
    ~ * ~ * ~ * 
    ~ * ~ * ~ * 
*/

//create server
let port = process.env.PORT || 8080;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));

//nedb database stuff
const Datastore = require('nedb');
let backupDB = new Datastore({filename: "databases/backup.db", autoload: true});
let ecosystemDB = new Datastore({filename: "databases/ecosystem.db", autoload: true});
