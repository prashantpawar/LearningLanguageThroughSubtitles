var m = {},
    connection,
    db;

m.config = require('./config');
m.mysql = require('mysql');
m.util = require('util');
m.async = require('async');
db = m.config.db;

connection = m.mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});


/**
connection.query(high_freq_query, function(err, rows, fields) {
    if (err) throw err;

    rows.forEach(function(row) {
        connection.query(m.util.format(keyword_query, row.word), function (err, rows, field) {
            if (err) throw err;

            rows.forEach(function(row) {
                console.log(row);
            });
        });
    });
    connection.end();
});
**/

//connection.end();

m.async.waterfall([
    function high_frequncy(callback) {
        var high_freq_query = "SELECT * FROM frequency_ru f WHERE f.id < 100 AND CHAR_LENGTH(f.word) > 3 ORDER BY RAND() LIMIT 25";
        connection.query(high_freq_query, function(err, rows, fields) {
            callback(err, rows);
        });
    },
    function fetch_translations(keywords, callback) {
        var keyword_query = "SELECT * FROM translation t WHERE MATCH(t.ru) AGAINST('%s') AND ABS(t.en_word_length - t.ru_word_length) = 0 ORDER BY t.ru_word_length ASC LIMIT 20";
        //console.log(m.util.format(keyword_query, keywords[0].word));
        connection.query(m.util.format(keyword_query, keywords[0].word), function (err, rows, field) {
            callback(err, rows);
        });
    }], 
    function end_connection(err, result) {
        console.log(result);
        connection.end();
    }
);
