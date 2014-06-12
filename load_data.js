var modules = {},
    connection;

modules.fs = require('fs');
modules.xmlstream = require('xml-stream');
modules.config = require('./config');
modules.natural = require('natural');
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

var stream = modules.fs.createReadStream(modules.config.data_file + '/OpenSubtitles2013/en-ru.tmx');
var xml = new modules.xmlstream(stream);
var tokenizerRu = new modules.natural.AggressiveTokenizerRu();
var tokenizer = new modules.natural.AggressiveTokenizer();

xml.preserve('tu');
xml.collect('tuv');
var count = 0, text;
xml.on('endElement: tu', function(tu) {
    text = {};
    text[tu.tuv[0].$['xml:lang']] = tu.tuv[0].seg.$text; 
    text[tu.tuv[1].$['xml:lang']] = tu.tuv[1].seg.$text; 
    /**
    tu.tuv.forEach(function(item) {
        console.log(item.seg.$text);
    });
    **/
    console.log(text.ru, tokenizerRu.tokenize(text.ru).length);
    console.log(text.en, tokenizer.tokenize(text.en).length);
    //console.log(tu.tuv[1].seg.$text);
    if(count++ > 200) {
        process.exit();
    }
});
