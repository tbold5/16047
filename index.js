const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const path = require("path");
const mysql = require("mysql");
const envjs = require("./env");

/**
 * FINAL CONSTANT VARIABLES
 */
const httpPort = 80;
const httpsPort = process.env.PORT || 443;

/**
 * Database Connection.
 */
const dbconnection = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    user: "sql3400153",
    password: "1pCKQbqnDF",
    database: "sql3400153",
    port: 3306,
});

dbconnection.connect((error) => {
    if (error) {
        console.log(error.message);
    } else {
        console.log("Connected to database");
    }
});

/**
 * Handles urls.
 * @param {Response} req
 * @param {Request} res
 */
function router(req, res) {
    /**
     * Holds the parsed query.
     */
    const q = url.parse(req.url, true);

    let body = "";
    req.on("data", (data) => {
        body += data.toString();
    });

    req.on("end", () => {
        let parsedQuery = qs.parse(body);

        switch (q.path.split("?")[0]) {
            case "/COMP4537/assignments/quizindb":
                fs.readFile(
                    path.join(
                        __dirname,
                        "/COMP4537/assignments/quizindb/index.html"
                    ),
                    (err, html) => {
                        if (err) throw err;
                        res.writeHead(200, {
                            "Content-Type": "text/html",
                            "Content-Length": html.length,
                        });
                        res.write(html);
                        res.end();
                    }
                );
                break;
            case "/COMP4537/assignments/quizindb/admin":
                fs.readFile(
                    path.join(
                        __dirname,
                        "/COMP4537/assignments/quizindb/admin.html"
                    ),
                    (err, html) => {
                        if (err) throw err;
                        res.writeHead(200, {
                            "Content-Type": "text/html",
                            "Content-Length": html.length,
                        });
                        res.write(html);
                        res.end();
                    }
                );
                break;

            case "/COMP4537/assignments/quizindb/questions":
                switch (req.method) {
                    case "GET":
                        dbconnection.query(
                            "SELECT * from questions",
                            (err, result, fields) => {
                                if (err)
                                    return res.end(
                                        "Error: fetching data from databse"
                                    );

                                let questions = result.map((rowDataPacket) => ({
                                    ID: rowDataPacket.ID,
                                    QUIZ_ID: rowDataPacket.QUIZ_ID,
                                    TEXT: rowDataPacket.TEXT,
                                    ANSWERS: [],
                                }));

                                stringifiedResult = JSON.stringify(questions);

                                return res.end(stringifiedResult);
                            }
                        );

                        break;
                    case "POST":
                        dbconnection.query(
                            `
                            INSERT INTO questions(TEXT)
                            VALUES ("")
                            `,
                            (err, result, fields) => {
                                if (err)
                                    return res.end(
                                        "Error: fetching data from databse"
                                    );
                                return res.end("Question Created Successfully");
                            }
                        );
                        break;
                    case "PUT":
                        for (let answer of JSON.parse(body).ANSWERS) {
                            dbconnection.query(
                                `
                                UPDATE answers
                                SET TEXT = '${answer.TEXT}', CORRECT=${answer.CORRECT}
                                WHERE ID = ${answer.ID}
                                `,
                                (err, result, fields) => {
                                    if (err) console.log(err);
                                    console.log(result);
                                }
                            );
                        }
                        dbconnection.query(
                            `
                            UPDATE questions
                            SET TEXT = '${JSON.parse(body).TEXT}'
                            WHERE ID = ${JSON.parse(body).ID}
                            `,
                            (err, result, fields) => {
                                if (err) console.log(err);
                                return res.end("SUCCESSFULLY DELETED QUESTION");
                            }
                        );
                        break;
                    case "DELETE":
                        for (let answer of JSON.parse(body).ANSWERS) {
                            dbconnection.query(
                                `
                                DELETE FROM answers WHERE ID = ${answer.ID}
                                `,
                                (err, result, fields) => {
                                    if (err) console.log(err);
                                    console.log(result);
                                }
                            );
                        }
                        dbconnection.query(
                            `
                            DELETE FROM questions WHERE ID = ${
                                JSON.parse(body).ID
                            }
                            `,
                            (err, result, fields) => {
                                if (err) console.log(err);
                                return res.end("SUCCESSFULLY DELETED QUESTION");
                            }
                        );
                        break;
                }
                break;
            case "/COMP4537/assignments/quizindb/answers":
                switch (req.method) {
                    case "GET":
                        dbconnection.query(
                            "SELECT * from answers",
                            (err, result, fields) => {
                                if (err)
                                    return res.end(
                                        "Error: fetching data from databse"
                                    );

                                let answers = result.map((rowDataPacket) => ({
                                    ID: rowDataPacket.ID,
                                    QUESTION_ID: rowDataPacket.QUESTION_ID,
                                    TEXT: rowDataPacket.TEXT,
                                    CORRECT: rowDataPacket.CORRECT,
                                }));

                                stringifiedResult = JSON.stringify(answers);

                                return res.end(stringifiedResult);
                            }
                        );

                        break;
                    case "POST":
                        dbconnection.query(
                            `INSERT INTO answers(QUESTION_ID, CORRECT) VALUES(${
                                JSON.parse(body).ID
                            }, 0)`,
                            (err, result, fields) => {
                                if (err)
                                    return res.end(
                                        "Error: fetching data from databse"
                                    );
                                return res.end("SUCCESSFULLY ADDED ANSWER");
                            }
                        );
                        break;
                    case "DELETE":
                        dbconnection.query(
                            `DELETE FROM answers WHERE ID = ${
                                JSON.parse(body).ID
                            }`,
                            (err, result, fields) => {
                                if (err)
                                    return res.end(
                                        "Error: fetching data from databse"
                                    );
                                return res.end("SUCCESSFULLY DELETED ANSWER");
                            }
                        );
                        break;
                }
                break;
            case "/COMP4537/assignments/quizindb/student":
                fs.readFile(
                    path.join(
                        __dirname,
                        "/COMP4537/assignments/quizindb/student.html"
                    ),
                    (err, html) => {
                        if (err) throw err;
                        res.writeHead(200, {
                            "Content-Type": "text/html",
                            "Content-Length": html.length,
                        });
                        res.write(html);
                        res.end();
                    }
                );
                break;

            /**
             * Serve Static Files
             */
            default:
                fs.readFile(path.join(__dirname, q.path), (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        console.log(err.message);
                        return res.end(`Error 404: ${q.pathname} Not Found`);
                    }
                    return res.end(data);
                });
        }
    });
}

/**
 * HTTP Server, redirects to https server.
 */
http.createServer((req, res) => {
    if (envjs.NODE_ENV == "production") {
        res.writeHead(302, {
            Location: "https://" + req.headers.host + req.url,
        });
        return res.end();
    }

    router(req, res);
}).listen(httpPort, () => {
    console.log(`Server listening at http://localhost:${httpPort}`);
});

/**
 * HTTPS server
 */
if (envjs.NODE_ENV == "production") {
    try {
        https
            .createServer(
                {
                    key: fs.readFileSync(
                        "/etc/letsencrypt/live/trae-bold.com-0001/privkey.pem",
                        "utf-8"
                    ),
                    cert: fs.readFileSync(
                        "/etc/letsencrypt/live/trae-bold.com-0001/fullchain.pem",
                        "utf-8"
                    ),
                },
                (req, res) => {
                    router(req, res);
                }
            )
            .listen(httpsPort, () => {
                console.log(
                    `Server listening at https://localhost:${httpsPort}`
                );
            });
    } catch (err) {
        console.log(err.message);
    }
}
