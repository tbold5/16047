const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab5'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    let sql = "INSERT INTO score(name, score) VALUES ('Elon Musk', 2900)";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
});
