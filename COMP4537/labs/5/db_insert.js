const http = require('http');
const mysql = require('appWrite');
const url = require('url');
const server = http.createServer(function (req,res) {
    let q = url.parse(req.url, true);
    console.log(q.query);
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
    });
    if (res.statusCode === 200){
        mysql.Database(q.query["name"], q.query["score"]);
    }
    res.end(q.query["name"] + ":" + q.query["score"] + " was Stored in the DB")
});
server.listen(8080);
