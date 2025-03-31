require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
const dbTestRoutes = require("./src/routes/dbTest"); // Importa la ruta

app.use("/api", dbTestRoutes); // Agrega la ruta al servidor
