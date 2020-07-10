const { Pool, Client } = require("pg");

if (process.env.DATABASE_URL) {
  let parsedURL = require("url").parse(process.env.DATABASE_URL);
  process.env.PGHOST = parsedURL.hostname;
  process.env.PGPORT = parsedURL.port;
  process.env.PGDATABASE = parsedURL.path.slice(1);
  process.env.PGUSER = parsedURL.auth.split(":")[0];
  process.env.PGPASSWORD = parsedURL.auth.split(":")[1];
}

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || "minesweeper",
  user: process.env.PGUSER || "brianprice",
  password: process.env.PGPASSWORD || "",
});

const queries = {
  getHighScores: () => pool.query("SELECT * FROM HighScores"),
  postHighScore: (name, time, level) =>
    pool.query(
      `INSERT INTO HighScores (name, time, level) values ('${name}', '${time}', '${level}')`
    ),
  updateHighScore: (name, time, level, nameToRemove, timeToRemove) =>
    pool.query(
      `UPDATE HighScores set name= '${name}', time='${time}' where name= '${nameToRemove}' AND time='${timeToRemove}' AND level='${level}' `
    ),
};

module.exports = queries;
