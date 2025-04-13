import pool from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const allowedFields = [
	"fecha_corte",
	"departamento",
	"provincia",
	"distrito",
	"metododx",
	"edad",
	"sexo",
	"fecha_resultado",
	"ubigeo",
	"id_persona",
];

export const getByField = async (req, res) => {
	const { field, value } = req.params;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const offset = (page - 1) * limit;

	if (!allowedFields.includes(field)) {
		return res.status(400).json({ error: "Campo no válido" });
	}

	try {
		console.log("🟡 Buscando por campo:", field, "valor:", value);

		// Consulta de datos paginada
		const dataQuery = `
			SELECT * FROM positivos_covid
			WHERE ${field} ILIKE $1
			LIMIT $2 OFFSET $3
		`;

		// Consulta de cantidad total
		const countQuery = `
			SELECT COUNT(*) FROM positivos_covid
			WHERE ${field} ILIKE $1
		`;

		const [dataResult, countResult] = await Promise.all([
			pool.query(dataQuery, [value, limit, offset]),
			pool.query(countQuery, [value]),
		]);

		const total = parseInt(countResult.rows[0].count, 10);

		res.json({
			total,
			page,
			limit,
			data: dataResult.rows,
		});
	} catch (error) {
		console.error("❌ Error exacto al buscar datos:", error.message);
		res.status(500).json({ error: "Error al buscar datos" });
	}
};

export const insertNew = async (req, res) => {
	try {
		const {
			fecha_corte,
			departamento,
			provincia,
			distrito,
			metododx,
			edad,
			sexo,
			fecha_resultado,
			ubigeo,
			id_persona,
		} = req.body;

		await pool.query(
			`INSERT INTO positivos_covid (
        fecha_corte, departamento, provincia, distrito,
        metododx, edad, sexo, fecha_resultado, ubigeo, id_persona
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
			[
				fecha_corte,
				departamento,
				provincia,
				distrito,
				metododx,
				edad,
				sexo,
				fecha_resultado,
				ubigeo,
				id_persona,
			]
		);

		res.json({ message: "Caso insertado correctamente" });
	} catch (err) {
		console.error("❌ Error exacto:", err.message);
		res.status(500).json({ error: "Error al insertar el caso" });
	}
};
