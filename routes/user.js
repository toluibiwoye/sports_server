var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const config = require("../config");
const { checkUserRole } = require("../middlewares/jwtService");

const checkRole = checkUserRole("coach", "analyst");

router.post("/register", async (req, res) => {
	try {
		console.log(req.body);
		const user = await User.create({ ...req.body });
		res.status(201).json({
			error: false,
			message: "User registered successfully",
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			res.status(401).json({ message: "Invalid credentials" });
			return;
		}

		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			config.DYNAMIC_CONFIG_JWT_KEY,
			{ expiresIn: config.DYNAMIC_CONFIG_JWT_EXPIRE_AT }
		);
		res.json({
			error: false,
			message: "Login succesful",
			user,
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.get("/profile", async (req, res) => {
	try {
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
			async (err, decoded) => {
				if (err) {
					return res.status(401).json({
						error: true,
						code: "UNAUTHORIZED",
						message: "Invalid token",
					});
				}

				const userId = decoded.userId;

				// Fetch user data based on the user ID
				const user = await User.findByPk(userId, {
					attributes: { exclude: ["password"] }, // Exclude password from the response
				});

				if (!user) {
					return res
						.status(404)
						.json({ error: true, message: "User not found" });
				}

				res.json({ error: false, user });
			}
		);
	} catch (error) {
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.put("/profile", async (req, res) => {
	try {
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
			async (err, decoded) => {
				if (err) {
					return res.status(401).json({
						error: true,
						code: "UNAUTHORIZED",
						message: "Invalid token",
					});
				}

				const userId = decoded.userId;

				// Fetch user data based on the user ID
				const user = await User.findByPk(userId);

				if (!user) {
					return res
						.status(404)
						.json({ error: true, message: "User not found" });
				}

				// Update user data with the information from the request body
				await user.update(req.body);

				// Fetch updated user data
				const updatedUser = await User.findByPk(userId, {
					attributes: { exclude: ["password"] },
				});

				res.json({ error: false, user: updatedUser });
			}
		);
	} catch (error) {
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.post("/", checkRole, async (req, res) => {
	try {
		const users = await User.getAll();
		res.status(201).json({
			error: false,
			message: "Users",
			list: users,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

module.exports = router;
