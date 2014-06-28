var modules = {},
    connection,
    db;

modules.config = require('./config');
modules.mysql = require('mysql');
modules.util = require('util');
modules.q = require('q');
db = modules.config.db;

connection = modules.mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

var high_freq_query = "SELECT * FROM frequency_ru f WHERE f.id < 100 AND CHAR_LENGTH(f.word) > 3 ORDER BY RAND() LIMIT 25";
var keyword_query = "SELECT * FROM translation t WHERE t.ru LIKE '%s' AND ABS(t.en_word_length - t.ru_word_length) = 0 ORDER BY t.ru_word_length ASC LIMIT 20";

connection.query(high_freq_query, function(err, rows, fields) {
    if (err) throw err;

    rows.forEach(function(row) {
        connection.query(modules.util.format(keyword_query, row.word), function (err, rows, field) {
            if (err) throw err;

            rows.forEach(function(row) {
                console.log(row);
            });
        });
    });
    connection.end();
});

//connection.end();
