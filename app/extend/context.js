const path = require('path');
const { JsonDB, Config } = require('node-json-db');
module.exports = {
  get db() {
    const { app } = this;
    const { dbFilePath } = app.config;
    const filePath = path.join(app.baseDir, dbFilePath);
    return new JsonDB(new Config(filePath, true, true, '/'));
  },
};
