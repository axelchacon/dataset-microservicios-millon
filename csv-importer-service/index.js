import express from "express";
import dotenv from "dotenv";
import { loadCsvData } from "./utils/csvLoader.js";

dotenv.config();
const app = express();

app.get("/cargar", async (req, res) => {
	try {
		await loadCsvData("./positivos_covid.csv");
		res.send("✅ Datos importados a PostgreSQL");
	} catch (err) {
		console.error("❌ Error al importar CSV:", err.message);
		res.status(500).send("Error al importar CSV");
	}
});

app.listen(8081, () => {
	console.log("🟢 Microservicio CSV corriendo en http://localhost:8081");
});
