const { Model, DataTypes, NOW } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}
Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  },
  {
    sequelize,
    underscored: true,
    modelName: "session",
  }
);
