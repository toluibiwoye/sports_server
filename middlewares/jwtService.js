const jwt = require("jsonwebtoken");
const config = require("../config");

const checkUserRole = (requiredRole) => {
	return (req, res, next) => {
		const token = req.headers.authorization;

		if (!token) {
			return res.status(401).json({
				error: true,
				code: "UNAUTHORIZED",
				message: "Token not provided",
			});
		}

		// Check if the token starts with "Bearer "
		if (!token.startsWith("Bearer ")) {
			return res.status(401).json({
				error: true,
				code: "UNAUTHORIZED",
				message: "Invalid token format",
			});
		}

		const tokenValue = token.slice(7); // Remove "Bearer " from the token

		// Verify the token and decode it
		jwt.verify(
			tokenValue,
			config.DYNAMIC_CONFIG_JWT_KEY,
			(err, decoded) => {
				if (err) {
					return res.status(401).json({
						error: true,
						code: "UNAUTHORIZED",
						message: "Invalid token",
					});
				}

				const userRole = decoded.role;

				if (userRole !== requiredRole) {
					return res.status(403).json({
						error: true,
						code: "FORBIDDEN",
						message: "Insufficient privileges for this action",
					});
				}

				next();
			}
		);
	};
};

module.exports = { checkUserRole };
