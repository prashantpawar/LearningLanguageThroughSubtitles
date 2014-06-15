return;
var modules = {},
    connection;

modules.fs = require('fs');
modules.xmlstream = require('xml-stream');
modules.config = require('./config');
modules.natural = require('natural');
modules.mysql = require('mysql');
var db = modules.config.db;
connection = modules.mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

var stream = modules.fs.createReadStream(modules.config.data_file + '/OpenSubtitles2013/en-ru.tmx');
var xml = new modules.xmlstream(stream);
var tokenizerRu = new modules.natural.AggressiveTokenizerRu();
var tokenizer = new modules.natural.AggressiveTokenizer();

xml.preserve('tu');
xml.collect('tuv');
var count = 0, query, query_data;
xml.on('endElement: tu', function(tu) {
    query_data = {};
    tu.tuv.forEach(function(item) {
        query_data[item.$['xml:lang']] = item.seg.$text;
    });
    query_data['ru_word_length'] = tokenizerRu.tokenize(query_data.ru).length; 
    query_data['en_word_length'] = tokenizer.tokenize(query_data.en).length; 

    xml.pause();
    query = connection.query("INSERT INTO translation SET ?", query_data, function(err, rows) {
        if(err) {
            throw err;
        } else {
            xml.resume();
            //console.log(rows);
        }
    });
});
