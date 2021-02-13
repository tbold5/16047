let http = require('http');
let url = require('url');
let fs = require('fs');
http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let filename = '.' + q.pathname;
    fs.readFile(filename, function(err) {
        if (q.filename != '/file.txt') {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end(q.pathname + " 404 Not Found!");
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        return res.end(data);
    });
}).listen(8889);