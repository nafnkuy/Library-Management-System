const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function queryOne(sql, params = []) {
  const dbPath = path.join(__dirname, '..', '..', 'database', 'library.db');
  const db = new sqlite3.Database(dbPath);
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = {
  queryOne,
};
