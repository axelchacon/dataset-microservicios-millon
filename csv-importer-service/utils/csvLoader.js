import fs from "fs";
import csv from "csv-parser";
import pool from "../db.js";
import { pipeline } from "stream/promises";
import { Transform } from "stream";

const BATCH_SIZE = 2000; // ✅ Tamaño seguro para evitar sobrecarga de parámetros

function parseDate(yyyymmdd) {
	if (!yyyymmdd || yyyymmdd.length !== 8) return null;
	return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(
		6,
		8
	)}`;
}

async function processBatch(batch) {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");

		const query = `
      INSERT INTO public.positivos_covid (
        fecha_corte, departamento, provincia, distrito,
        metododx, edad, sexo, fecha_resultado, ubigeo, id_persona
      ) VALUES ${batch
				.map(
					(_, i) =>
						`($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${
							i * 10 + 4
						}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${
							i * 10 + 8
						}, $${i * 10 + 9}, $${i * 10 + 10})`
				)
				.join(",")}
		`;

		const values = batch.flatMap((row) => [
			parseDate(row.FECHA_CORTE),
			row.DEPARTAMENTO,
			row.PROVINCIA,
			row.DISTRITO,
			row.METODODX,
			row.EDAD ? parseInt(row.EDAD) : null,
			row.SEXO,
			parseDate(row.FECHA_RESULTADO),
			row.UBIGEO,
			row.id_persona,
		]);

		await client.query(query, values);
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("❌ Error al procesar batch:", error.message);
		throw error;
	} finally {
		client.release();
	}
}

export async function loadCsvData(filePath) {
	let batch = [];
	let total = 0;

	const batchTransform = new Transform({
		objectMode: true,
		async transform(chunk, encoding, callback) {
			batch.push(chunk);
			if (batch.length >= BATCH_SIZE) {
				try {
					await processBatch(batch);
					total += batch.length;
					console.log(`✅ Procesados ${total} registros...`);
					batch = [];
					callback();
				} catch (err) {
					console.error("❌ Error en lote:", err.message);
					callback(err);
				}
			} else {
				callback();
			}
		},
		async flush(callback) {
			if (batch.length > 0) {
				try {
					await processBatch(batch);
					total += batch.length;
					console.log(`✅ Procesados ${total} registros (final)...`);
					callback();
				} catch (err) {
					console.error("❌ Error al finalizar carga:", err.message);
					callback(err);
				}
			} else {
				callback();
			}
		},
	});

	await pipeline(
		fs.createReadStream(filePath),
		csv({ separator: ";" }), // Asegúrate de que tu CSV use ;
		batchTransform
	);

	console.log(`🎉 Total de registros cargados: ${total}`);
	return total;
}
