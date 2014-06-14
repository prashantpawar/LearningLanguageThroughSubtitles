var modules = {},
    connection,
    db;

modules.config = require('./config');
modules.mysql = require('mysql');
db = modules.config.db;

connection = modules.mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

connection.query("SELECT * FROM translation t WHERE t.ru LIKE '%Кровь%' AND ABS(t.en_word_length - t.ru_word_length) = 0 ORDER BY t.ru_word_length ASC LIMIT 100", function(err, rows, fields) {
  if (err) throw err;

  rows.forEach(function(row) {
    console.log(row.ru, row.en);
  });
});

connection.end();
