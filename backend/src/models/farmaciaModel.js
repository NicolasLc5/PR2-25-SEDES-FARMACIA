const db = require("../config/db");

// Obtener todas las farmacias (coordenadas y nombre)
const getFarmacias = async () => {
  const [rows] = await db.execute("SELECT id, nombre, latitud, longitud FROM farmacia WHERE status = 1");
  return rows;
};

// Obtener detalles de una farmacia con horarios en JSON
const getFarmaciaById = async (id) => {
  const [rows] = await db.execute(
    `SELECT 
        f.nombre,
        f.imagen,
        COALESCE(
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'apertura', IFNULL(TIME_FORMAT(h.hora_entrada, '%H:%i'), ''),
                    'cierre', IFNULL(TIME_FORMAT(h.hora_salida, '%H:%i'), '')
                )
            ),
            CAST('[]' AS JSON)
        ) AS horarios

    FROM farmacia f
    LEFT JOIN farmacia_horas fh ON f.id = fh.farmacia_id
    LEFT JOIN horas h ON fh.hora_id = h.id
    WHERE f.id = ?
    GROUP BY f.id;`,
    [id]
  );
  return rows[0];
};

// Crear una nueva farmacia
const createFarmacia = async (data) => {
  const { nombre, numero_registro, direccion, latitud, longitud, fecha_registro, razon_social, nit, zona_id, dueno_id, codigo_id, usuario_id, imagen, horario_atencion, tipo } = data;
  const [result] = await db.execute(
    "INSERT INTO farmacia (nombre, numero_registro, direccion, latitud, longitud, fecha_registro, razon_social, nit, zona_id, dueno_id, codigo_id, usuario_id, imagen, horario_atencion, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [nombre, numero_registro, direccion, latitud, longitud, fecha_registro, razon_social, nit, zona_id, dueno_id, codigo_id, usuario_id, imagen, horario_atencion, tipo]
  );
  return result.insertId;
};

// Editar una farmacia
const updateFarmacia = async (id, data) => {
  const { nombre, numero_registro, direccion, latitud, longitud, imagen, horario_atencion, tipo } = data;
  const [result] = await db.execute(
    "UPDATE farmacia SET nombre=?, numero_registro=?, direccion=?, latitud=?, longitud=?, imagen=?, horario_atencion=?, tipo=? WHERE id=?",
    [nombre, numero_registro, direccion, latitud, longitud, imagen, horario_atencion, tipo, id]
  );
  return result.affectedRows > 0;
};

// Eliminar una farmacia (cambio de status)
const deleteFarmacia = async (id) => {
  const [result] = await db.execute("UPDATE farmacia SET status = 0 WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
if (rows[0]?.imagen) {
  rows[0].imagen = `data:image/jpeg;base64,${rows[0].imagen}`;
}
module.exports = { getFarmacias, getFarmaciaById, createFarmacia, updateFarmacia, deleteFarmacia };
