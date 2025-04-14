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

## Estructura

│Carpeta_app
│
├── covid-query-service/ # Microservicio 2: Consultas API REST
│ ├── controllers/
│ │ └── covidController.js
│ ├── routes/
│ │ └── covid.js
│ ├── db.js
│ ├── index.js
│ ├── .env
│ ├── Dockerfile
│ ├── .dockerignore
│ └── package.json
│
├── csv-importer-service/ # Microservicio 1: Carga masiva desde CSV
│ ├── utils/
│ │ └── csvLoader.js
│ ├── db.js
│ ├── index.js
│ ├── .env
│ ├── Dockerfile
│ ├── .dockerignore
│ └── package.json
│ └── positivos_covid.csv # Archivo CSV de datos masivos
│
│  
├── docker-compose.yml # Archivo de definición de servicios
├── init.sql # Script SQL para crear tabla si no existe
│  
└── README.md

## añadir los siguiente archivos:

- EN la carpeta raíz del proyecto , añade un archivo docker-compose.yml
  -en cada microservicio en la carpeta raíz de cada microservicio , añade un archivo en cada uno DockerFile y .dockerignore
  -En la carpeta raíz del proyecto , añade un archivo init.sql:

  ```
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

  ```

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

# Subir imágenes Docker a Docker Hub :

-username en docker: axelchacon123
-carpetas del microservicios: covid-query-service y csv-importer-service
-nombres de las imágenes en tu docker: dataset-microservicios-millon-covid-query-service y dataset-microservicios-millon-csv-importer-service

1.1 Inicia sesión en Docker Hub : docker login
1.2 Etiqueta las imágenes existentes (ya construidas previamente con docker-compose) con estos comandos:
-docker tag dataset-microservicios-millon-covid-query-service axelchacon123/covid-query-service

-docker tag dataset-microservicios-millon-csv-importer-service axelchacon123/csv-importer-service
1.3 Sube las imágenes etiquetadas a Docker Hub con estos comandos:
-docker push axelchacon123/covid-query-service
-docker push axelchacon123/csv-importer-service
1.4. Ya está en docker hub

# Con nuestra instanciacreada y dentro de ella:

## Estructura: Nueva carpeta dentro de tu instancia con los nuevos archivos donde el init.sql es igual al anterior, el csv es igual al anterior, pero el docker compose.yml ha cambiado un poco por el docker hub:

│-millon-datos
├── positivos_covid.csv # Archivo de datos masivos
├── init.sql # Script SQL para crear la tabla
├── docker-compose.yml

## Preparar instancia AWS EC2

### Paso 1: Crear una instancia EC2 Ubuntu en AWS:

-Tipo de instancia: t2.micro o superior

-Sistema operativo: Ubuntu 22.04 LTS

-Asignar un grupo de seguridad con los siguientes puertos abiertos:
--22 (SSH)

--5432 (PostgreSQL - opcional solo si quieres acceso remoto)

--3002 (API query)

--8081 (CSV loader)

### Paso 2: Conectarte a la instancia EC2 desde tu WSL o en cualquier sistema operativo:

ssh -i clave.pem ubuntu@IP_PUBLICA_PV4_EC2

### Paso 3: Instalar Docker y Docker Compose en EC2

-Sigue estos paso para instalar hasta "groups" : https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04

-Nota: cuando llegues a "groups" , pon en el comando terminal de tu instancia "groups". Esto te mostraré un texto donde al final aparece ".... lxd". Luego pon "exit" para salir de tu instancia. Luego te vuelves a conectar a tu instancia, pones "groups" de nuevo y aparece una sentencia ".... lxd docker". Esto significa que está bien docker y ya no necesitas hacer más.

### Paso 4: Subir o crear los archivos necesarios a tu instancia EC2 dentro de tu nueva carpeta "millon-datos" :

-crea una carpeta con el nombre que quieras como "millon-datos" donde debe haber tres arcivos: docker-compose.yml, init.sql, y positivos_codid.csv.

-dentro de la carpeta crea un archivo docker-compose.yml como esto:

```
      version: "3.8"

      services:
        db:
          image: postgres:15
          container_name: covid-postgres
          restart: always
          environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: 123456
            POSTGRES_DB: positivos_covid
          ports:
            - "5432:5432"
          volumes:
            - pgdata:/var/lib/postgresql/data
            - ./init.sql:/docker-entrypoint-initdb.d/init.sql # crea la tabla si no existe

        covid-query-service:
          image: axelchacon123/covid-query-service:latest  # 👈 usas tu imagen de Docker Hub
          container_name: covid-query-service
          depends_on:
            - db
          ports:
            - "3002:3002"
          environment:
            PGHOST: db
            PGUSER: postgres
            PGPASSWORD: 123456
            PGDATABASE: positivos_covid
            PGPORT: 5432

        csv-importer-service:
          image: axelchacon123/csv-importer-service:latest  # 👈 también de Docker Hub
          container_name: csv-importer-service
          depends_on:
            - db
          ports:
            - "8081:8081"
          environment:
            PGHOST: db
            PGUSER: postgres
            PGPASSWORD: 123456
            PGDATABASE: positivos_covid
            PGPORT: 5432
          volumes:
            - ./positivos_covid.csv:/app/positivos_covid.csv # ✅ asegúrate de subir el CSV

      volumes:
        pgdata:


```

-usa el mismo archivo anterior de init.sql y el csv

### Paso 5: usas estos comandos detro de la capeta raíz que es dentro de "millon-datos" :

-- docker compose up -d
--docker ps
-- docker compose up --build -d

### Paso 6: verificar el funcionamiento con endpoint:

-- comando : docker logs csv-importer-service ; endpoint: GET http://IP_PUBLICA_EC2:8081/cargar sin Body
-- comando : docker compose logs -f covid-query-service ; endpoint 1: POST http://IP_PUBLICA_EC2:3002/api/nuevo con Body JSON

{
"fecha_corte": "20241203",
"departamento": "LIMA",
"provincia": "LIMA",
"distrito": "axel",
"metododx": "AG",
"edad": 23,
"sexo": "masculino",
"fecha_resultado": "20221207",
"ubigeo": "150113",
"id_persona": "123456"
}

, endpoint 2 : GET http://IP_PUBLICA_EC2:3002/api/buscar/departamento/LIMA?page=1&limit=10 sin BODY

--comando : docker exec -it covid-postgres psql -U postgres -d positivos_covid , donde te conectas a tu base de datos y tabla

### Paso 7: okok
