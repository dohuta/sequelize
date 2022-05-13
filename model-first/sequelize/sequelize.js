const { Sequelize } = require("sequelize");

// generate instace of sequelize
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "admin",
  password: "admin",
  database: "demo",
  port: 3306,
  sync: { force: true },
});

// import model definitions
const modelDefiners = [
  require("../models/User"),
  require("../models/Note"),
  require("../models/Token"),
  // require other model defs here
];

// initialize models
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

const applyExtraSetup = (sql) => {
  const { User, Token, Note } = sql.models;

  User.Notes = User.hasMany(Note);
  User.Tokens = User.hasMany(Token);
  Note.User = Note.belongsTo(User);
  Token.User = Token.belongsTo(User);
};

// adding relationships
applyExtraSetup(sequelize);

module.exports = sequelize;
