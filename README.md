# 🦠 COVID Microservices System (dataset-microservicios-millon) – Carga y Consulta de Datos Masivos

Este proyecto implementa una **arquitectura de microservicios** en Node.js que permite **importar, consultar y paginar millones de registros de casos COVID-19** usando una base de datos PostgreSQL y nodejs con type "module" con Express para la API , backend.

## 📦 Estructura de Microservicios

```
.
├── csv-importer-service/          # Microservicio 1: Carga masiva desde CSV
│   ├── utils/
│   │   └── csvLoader.js           # Lógica de carga por lotes
│   ├── positivos_covid.csv        # Archivo CSV con millones de registros
│   ├── index.js                   # Servidor Express
│   ├── db.js                      # Conexión PostgreSQL
│   ├── .env                       # Configuración de entorno
│   └── package.json
│
└── covid-query-service/          # Microservicio 2: Consultas con filtros y paginación
    ├── controllers/
    │   └── covidController.js     # Lógica para endpoints GET y POST
    ├── routes/
    │   └── covid.js               # Rutas de la API
    ├── index.js                   # Servidor Express
    ├── db.js                      # Conexión PostgreSQL
    ├── .env
    └── package.json
```

---

## 🔧 Tecnologías utilizadas

- ✅ Node.js (ESModules)
- ✅ Express.js
- ✅ PostgreSQL
- ✅ `pg` para conexión a base de datos
- ✅ `csv-parser` para parsear archivos CSV
- ✅ `stream/promises` para carga eficiente
- ✅ Arquitectura basada en microservicios
- ✅ Paginación y filtros dinámicos

---

## ⚙️ Configuración `.env`

Crea un archivo `.env` en **ambos microservicios** con la siguiente configuración:

```env
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=contrseña
PGDATABASE=positivos_covid
PGPORT=5432
```

Asegúrate de que la base de datos `positivos_covid` esté creada y contenga la tabla `positivos_covid`.

---

## 🧱 Microservicio 1: `csv-importer-service`

### 🚀 ¿Qué hace?

Importa millones de registros desde un archivo CSV (`positivos_covid.csv`) a una tabla PostgreSQL, usando carga por **lotes de 2000 registros** para evitar límites de PostgreSQL.

### 🛠️ Comandos para levantar el servicio:

```bash
cd csv-importer-service
npm install install dotenv pg
node index.js
```

### 📤 Endpoint para cargar el CSV

```http
GET http://localhost:8081/cargar
```

Esto procesará por lotes los registros del CSV y los insertará en la base de datos. Verás mensajes como:

```
✅ Procesados 2000 registros...
✅ Procesados 4000 registros...
...
🎉 Total de registros cargados: 4000000
```

### ✅ Formato del CSV esperado

El archivo `positivos_covid.csv` debe tener las siguientes columnas y usar **punto y coma (;) como separador**:

```
FECHA_CORTE;DEPARTAMENTO;PROVINCIA;DISTRITO;METODODX;EDAD;SEXO;FECHA_RESULTADO;UBIGEO;id_persona
```

---

## 🧱 Microservicio 2: `covid-query-service`

### 🚀 ¿Qué hace?

Permite:

- Consultar registros por cualquier campo (`departamento`, `provincia`, `sexo`, etc.)
- Realizar consultas combinadas con múltiples filtros
- Usar paginación (`page`, `limit`)
- Insertar registros individuales manualmente

### 🛠️ Comandos para levantar el servicio:

```bash
cd covid-query-service
npm install dotenv pg
node index.js
```

### 📥 Insertar un nuevo caso (POST)

```http
POST http://localhost:3002/api/nuevo
```

#### Body JSON:

```json
{
	"fecha_corte": "20241203",
	"departamento": "LIMA",
	"provincia": "LIMA",
	"distrito": "JESUS MARIA",
	"metododx": "AG",
	"edad": 33,
	"sexo": "FEMENINO",
	"fecha_resultado": "20241207",
	"ubigeo": "150113",
	"id_persona": "123456"
}
```

---

### 🔍 Buscar por campo específico (GET)

```http
GET http://localhost:3002/api/buscar/departamento/LIMA?page=1&limit=10
```

#### Parámetros:

- `:field` → campo a buscar (`departamento`, `provincia`, `sexo`, etc.)
- `:value` → valor a buscar
- `?page` → página de resultados (por defecto 1)
- `?limit` → número de resultados por página (por defecto 10)

#### Respuesta:

```json
{
  "total": 13482,
  "page": 1,
  "limit": 10,
  "data": [ { ... }, { ... } ]
}
```

---

## 🧑‍💻 Autor

**Axel Diego Chacón Pérez** – Arquitectura moderna para procesamiento de datos masivos  
**Proyectos con impacto, escalabilidad y performance.**

---

# Dockeniar # 🦠 COVID Microservices System (dataset-microservicios-millon) – Carga y Consulta de Datos Masivos

## añadir los siguiente archivos:

- EN la carpeta raíz del proyecto , añade un archivo docker-compose.yml
  -en cada microservicio en la carpeta raíz de cada microservicio , añade un archivo en cada uno DockerFile y .dockerignore
  -En la carpeta raíz del proyecto , añade un archivo init.sql
  -modificar el .env en cada microservicio con para evitar incompatibilidades del docker :
  ```env
  PGHOST=db
  PGUSER=postgres
  PGPASSWORD=123456
  PGDATABASE=positivos_covid
  PGPORT=5432
  ```

## Luego de terminar las configuraciones necesarias usamos los siguientes comando para dokenizar:

```
-docker-compose down -v
-docker-compose build --no-cache
-docker-compose up -d (se creó el docker)

```

## Verificamos si correo el docker :

-docker-compose ps ( no debe haber alertas o errores)
-verificar si existe la base de datos creada y su tabla: docker logs covid-postgres si no hay errores, y docker exec -it covid-postgres psql -U postgres -d positivos_covid para entrar a la tabla creada y puedes usar los comandos de sql para ver (\dt , SELECT* FROM positivos_covid; , SELECT COUNT(*) FROM positivos_covid; )

- usando los endpoints en postman que es lo mismo que el local que son los de GET http://localhost:8081/cargar sin body , GET con http://localhost:3002/api/buscar/departamento/LIMA?page=1&limit=16 sin body y POST con body igual al de local que se meniona al inicio con http://localhost:3002/api/nuevo , usa los comando : -docker-compose logs -f csv-importer-service: para verificar si los endpoints en postman funcionan del servicio de la carpeta "csv-importer-service"
- docker-compose logs -f covid-query-service : si los endpoints en postman funcionan del servicio de la carpeta "covid-query-service"
