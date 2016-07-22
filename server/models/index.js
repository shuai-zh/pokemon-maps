import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

var dbConfig = {
  dialect: 'postgres',
  protocol: 'postgres'
};

// use ssl in production
if (process.env.NODE_ENV === 'production') {
  dbConfig.dialectOptions = {
    ssl: true
  };
}


const sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);

let db = {};

sequelize.sync({force: false});

fs
  .readdirSync(__dirname)
  .filter(file=> {
    return (path.extname(file) == '.js') && (file !== "index.js");
  })
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName=> {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
