var modules = {},
    connection;

modules.fs = require('fs');
modules.readline = require('readline');
modules.stream = require('stream');
modules.config = require('./config');
modules.mysql = require('mysql');
(function () {
    var db = modules.config.db;
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
});


var en_stream = modules.fs.createReadStream(modules.config.data_file + "/en_sample.txt");
var ru_stream = modules.fs.createReadStream(modules.config.data_file + "/ru_sample.txt");

var en_rl = modules.readline.createInterface({
    input: en_stream,
    terminal: false
});
var ru_rl = modules.readline.createInterface({
    input: ru_stream,
    terminal: false
});

var en_rl_count = ru_rl_count = 0,
    line_buffer = [];
en_rl.on('line', function(line) {
    obj = line_buffer[line_buffer.length - 1];
    if(obj && obj.ru_text) {
        console.log(obj);
    }
});

ru_rl.on('line', function(line) {
});
