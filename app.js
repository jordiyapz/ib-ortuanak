const PORT = process.env.PORT || 8081
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

const IndexRouter = require("./app/index/router");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// public directory
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/api", IndexRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
module.exports = app;
