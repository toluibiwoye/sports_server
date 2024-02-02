module.exports = (sequelize, DataTypes) => {
	const Stats = sequelize.define(
		"Stats",
		{
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
			},
			physicals: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			speed: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			stamina: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			strength: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
			tableName: "stats",
		},
		{
			underscoredAll: false,
			underscored: false,
		}
	);

	return Stats;
};
