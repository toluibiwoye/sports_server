var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { Stats } = require("../models");
const config = require("../config");
const { checkUserRole } = require("../middlewares/jwtService");

const checkRole = checkUserRole("coach", "analyst");

router.get("/", async (req, res) => {
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

				const stats = await Stats.findAll();
				res.json({ error: false, message: "Succesful", stats: stats });
			}
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.get("/:user_id", async (req, res) => {
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

				const userId = req.params.user_id;

				// Fetch stats based on the user_id
				const userStats = await Stats.findOne({
					where: { user_id: userId },
				});

				if (!userStats) {
					return res.status(404).json({
						error: true,
						code: "NOT_FOUND",
						message: "Stats not found for the specified user",
					});
				}

				res.json({
					error: false,
					message: "Succesful",
					stats: userStats,
				});
			}
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

router.post("/", checkRole, async (req, res) => {
	try {
		console.log(req.body);
		const stat = await Stats.create({ ...req.body });
		res.status(201).json({
			error: false,
			message: "Stats added successfully",
			stat,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

// Update pass user_id in route
router.put("/:user_id", checkRole, async (req, res) => {
	try {
		const userId = req.params.user_id;

		// Fetch stats based on the user_id
		const updatedStat = await Stats.findOne({
			where: { user_id: userId },
		});

		if (!updatedStat) {
			return res.status(404).json({
				error: true,
				code: "NOT_FOUND",
				message: "Stats not found",
			});
		}

		// Update the stat with the information from the request body
		await updatedStat.update(req.body);

		// Fetch the updated stat data
		const updatedStatData = await Stats.findByPk(statId);

		res.json({
			error: false,
			message: "Stats updated successfully",
			stat: updatedStatData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, message: `${error}` });
	}
});

module.exports = router;
