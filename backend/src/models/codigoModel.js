const db = require("../config/db");

const getCodigos = async () => {
  const [rows] = await db.execute("SELECT * FROM codigo");
  return rows;
};

module.exports = { getCodigos };
