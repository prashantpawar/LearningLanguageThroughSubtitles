var modules = {},
    connection;

modules.fs = require('fs');
modules.readline = require('readline');
modules.stream = require('stream');
modules.config = require('./config');
modules.mysql = require('mysql');
db = modules.config.db;
connection = modules.mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

connection.connect();
connection.query("SHOW TABLES;", function(err, rows) {
    if(err) {
        throw err;
    } else {
        console.log(rows);
    }
});
connection.end();


var en_stream = modules.fs.createReadStream(modules.config.data_file + "/en_sample.txt");
var ru_stream = modules.fs.createReadStream(modules.config.data_file + "/ru_sample.txt");

var r1 = modules.readline.createInterface({
    input: en_stream,
    terminal: false
});
var r2 = modules.readline.createInterface({
    input: ru_stream,
    terminal: false
});

var r1_count = r2_count = 0;
r1.on('line', function(line) {
    console.log(line);
    this.pause();
    r2.resume();
});

r2.on('line', function(line) {
    console.log(line);
    this.pause();
    r1.resume();
});
