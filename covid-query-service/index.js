import express from "express";
import dotenv from "dotenv";
import covidRoutes from "./routes/covid.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", covidRoutes);

const PORT = 3002;
app.listen(PORT, () => {
	console.log(
		`🟢 Microservicio covid-query corriendo en http://localhost:${PORT}`
	);
});
