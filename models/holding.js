"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class holding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      holding.belongsTo(models.user, { foreignKey: "userId" });
    }
  }
  holding.init(
    {
      asset: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "holding",
    }
  );
  return holding;
};
