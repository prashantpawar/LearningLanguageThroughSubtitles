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


m.async.waterfall([
    function high_frequncy(callback) {
        var high_freq_query = "SELECT * FROM frequency_ru f WHERE f.id < 100 AND CHAR_LENGTH(f.word) > 3 ORDER BY RAND() LIMIT 25";
        connection.query(high_freq_query, function(err, rows, fields) {
            callback(err, rows);
        });
    },
    function fetch_translations(keywords, callback) {
        var keyword_query = "SELECT * FROM translation t WHERE MATCH(t.ru) AGAINST('%s') AND ABS(t.en_word_length - t.ru_word_length) = 0 AND t.ru_word_length < 5 LIMIT 20";
        connection.query(m.util.format(keyword_query, keywords[0].word), function (err, rows, field) {
            callback(err, rows);
        });
    }], 
    function display_quiz(err, result) {
        var quizes = [], quiz = {};
        var BreakException = {};
        try {
            result.forEach(function (row) {
                if(!quiz.question) {
                    quiz.question = row.ru;
                    quiz.answer = row.en;
                    quiz.options = [{ru: row.ru, en: row.en}];
                } else if(quiz.options.length < 4) {
                    quiz.options.push({ru:row.ru, en: row.en});
                } else {
                    throw BreakException;
                }
            });
        }catch(e) {
            if(e !== BreakException) throw e;
        }
        console.log(quiz);
        connection.end();
    }
);
