const db = require("../config/db");

const getZonas = async () => {
  const [rows] = await db.execute("SELECT * FROM zona");
  return rows;
};

module.exports = { getZonas };
