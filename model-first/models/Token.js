const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class Token extends Model {}

  Token.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Token", // We need to choose the model name
    }
  );

  return Token;
};
