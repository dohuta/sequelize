/***
 * run this command
 *  node auto/generate.js
 */

var SequelizeAuto = require("sequelize-auto");
var Promise = require("bluebird");

if (process.argv[1].indexOf("generate.js") !== -1) {
  generateModel();
}

function generateModel() {
  Promise.coroutine(function* () {
    var config = require("./config");
    var auto = new SequelizeAuto(
      config.database.database,
      config.database.username,
      config.database.password,
      {
        host: config.database.host,
        dialect: config.database.dialect,
        port: config.database.port,
        schema: config.database.schema,
        additional: {
          timestamps: false,
          schema: config.database.schema,
        },
        tables: config.tables,
        directory: config.directory,
      }
    );

    auto.run(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully generated models");
        process.exit();
      }
    });
  })();
}

module.exports = generateModel;
