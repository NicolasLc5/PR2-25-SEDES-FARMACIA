const db = require("../config/db");

const getSustancias = async () => {
  const [rows] = await db.execute("SELECT * FROM sustancias_controladas");
  return rows;
};

module.exports = { getSustancias };
