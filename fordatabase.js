var mysql = require('mysql');

var con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rto_exam_quiz'
})

con.connect(function (conn_err) {
    if (conn_err) {
        console.log(conn_err.message);
        return;
    }
    console.log("Connected to the database");
    var sql = "CREATE TABLE quiz_questions (question VARCHAR(555), option1 VARCHAR(255), option2 VARCHAR(255), option3 VARCHAR(255), option4 VARCHAR(255), correctanswer VARCHAR(10))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
      });
});

       
