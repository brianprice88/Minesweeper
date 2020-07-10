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

pool.connect().then((client) =>
  client
    .query("DROP TABLE IF EXISTS HighScores")
    .then((res) =>
      client.query(
        "CREATE TABLE IF NOT EXISTS HighScores(id SERIAL PRIMARY KEY, name VARCHAR NOT NULL, time INT NOT NULL, level VARCHAR NOT NULL);"
      )
    )
    .then((res) => {
      client.release();
    })
    .then((res) => console.log("connected to database successfully"))
    .catch((err) => console.error(err))
    .finally(() => pool.end())
);
