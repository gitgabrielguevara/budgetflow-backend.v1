const pool = require("../config/db");

const getUsers = async () => {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
};

module.exports = { getUsers };
