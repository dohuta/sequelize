const sequelize = require("./sequelize");

const sync = async () => {
  await sequelize.sync({ force: true });
  console.log("Database synced successfully");
};

module.exports = sync;
