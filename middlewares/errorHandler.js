const config = require("../config");

const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
	const statusCode = res?.statusCode === 200 ? 500 : res?.statusCode;
	res?.status(statusCode);
	res?.json({
		error: true,
		message: error?.message,
		stack: config.STAGE === "production" ? null : error?.stack,
	});
};
module.exports = { notFound, errorHandler };
