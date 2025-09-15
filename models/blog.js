const { Model, DataTypes, NOW } = require("sequelize");

const { sequelize } = require("../util/db");

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [1991],
          msg: "Year cannot be earlier than 1991",
        },
        max: {
          args: [new Date().getFullYear()],
          msg: `Year cannot be later than this year`,
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "blog",
  }
);

module.exports = Blog;
