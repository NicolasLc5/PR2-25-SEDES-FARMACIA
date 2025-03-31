const db = require("../config/db");

const getZonas = async () => {
  const [rows] = await db.execute("SELECT * FROM zone");
  return rows;
};

module.exports = { getZonas };
