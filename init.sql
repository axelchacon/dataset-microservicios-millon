CREATE TABLE positivos_covid (
    id SERIAL PRIMARY KEY,
    fecha_corte DATE,
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    metododx VARCHAR(10),
    edad INTEGER,
    sexo VARCHAR(20),
    fecha_resultado DATE,
    ubigeo VARCHAR(10),
    id_persona VARCHAR(50)
);
