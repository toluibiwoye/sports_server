const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isIn: [["athlete", "coach", "analyst"]],
				},
			},
			firstName: {
				type: DataTypes.STRING,
				// allowNull: true,
			},
			lastName: {
				type: DataTypes.STRING,
				// allowNull: true,
			},
			phoneNumber: {
				type: DataTypes.STRING,
				// allowNull: true,
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "user",
		},
		{
			underscoredAll: false,
			underscored: false,
		}
	);

	// Hash the password before saving
	User.beforeCreate(async (user) => {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	});

	User.beforeUpdate(async (user) => {
		const saltRounds = 10;
		user.password = await bcrypt.hash(user.password, saltRounds);
	});

	return User;
};
