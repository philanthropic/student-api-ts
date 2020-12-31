const express = require("express"); // Importing express module
const app = express(); // Creating express object

const routes = require("./routes");

const slash = require("express-slash");
const bodyParser = require("body-parser");

// Parse request body
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.enable("strict routing");   
app.enable("case sensitive routing");

const serverSetup = async () => {
    // Register routes
    app.use(routes);
    // Register trailing slash
    app.use(slash());
    return app;
};

serverSetup()
    .then((httpServer) => {
        console.log("starting server on port 8000");
        const port = 8000;
        httpServer.listen(port);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
