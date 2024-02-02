var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var config = require("./config");
var usersRouter = require("./routes/user");
var statsRouter = require("./routes/stats");

const db = require("./models");

var cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

var app = express();

// app.set("port", 5000);
app.set("db", db);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/users/stats", statsRouter);

app.use(notFound);
app.use(errorHandler);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = config.STAGE === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;

const port = config.PORT || 9000;
app.listen(port, () => {
	console.log(`Server listening on port 9000`);
});
