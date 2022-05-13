const { Model, DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  class Note extends Model {}

  Note.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Note", // We need to choose the model name
    }
  );

  return Note;
};
