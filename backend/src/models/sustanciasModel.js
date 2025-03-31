const db = require("../config/db");

const getSustancias = async () => {
  const [rows] = await db.execute("SELECT * FROM controlledsubstances");
  return rows;
};

module.exports = { getSustancias };
