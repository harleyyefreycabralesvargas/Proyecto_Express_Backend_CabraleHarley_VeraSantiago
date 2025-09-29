# Backend Proyecto Películas

Este es el **backend** de la aplicación de gestión y visualización de películas. Provee una API REST que permite manejar usuarios, autenticación, películas, reseñas, likes/dislikes y categorías.  

---

## Tecnologías utilizadas
- **Node.js** con **Express** → framework para construir la API.  
- **MongoDB** → base de datos NoSQL para almacenar usuarios, películas y reseñas.  
- **JWT** → autenticación con tokens para sesiones seguras.  
- **bcryptjs** → encriptación de contraseñas.  
- **dotenv** → manejo de variables de entorno.  
- **CORS** → habilitación de acceso desde frontend.  

---

## Estructura del proyecto

### back

### config
Manejo de la base de datos de mongo db

### controllers
Lógica de negocio (películas, reseñas, usuarios)

### middleWares
Middlewares (auth, validaciones, permisos)

### models
Conexión a MongoDB y funciones CRUD

### routes
Definición de endpoints organizados por recurso

### .env 
Variables de entorno (JWT_SECRET, MONGO_URI, PORT, etc.)

### server.js  
Punto de entrada principal de la API

### swagger
Archivo creacion de la documentacion de api


## 🔑 Autenticación

El sistema usa JWT para autorizar peticiones:  
1. Al iniciar sesión el usuario recibe un token.  
2. Ese token se envía en cada petición en los headers:  

Authorization: Bearer **Token**

3. El middleware authMiddleware valida que el token sea correcto y recupera los datos del usuario.  
4. Con el middleware esAdmin se restringen acciones como crear, actualizar o eliminar películas solo a administradores.  



## Funcionalidades principales

###  Usuarios
- Registro e inicio de sesión.  
- Los usuarios se autentican mediante **email + contraseña**.  
- Roles:  
  - admin: puede crear, editar y eliminar películas.  
  - user: puede ver películas y dejar reseñas.  

###  Películas
- CRUD completo (crear, leer, actualizar, eliminar).  
- Cada película tiene:  
  - titulo, descripcion, director, poster, categoria, fechaPublicacion.  
- Funcionalidades extra:  
  - Obtener películas **random**, **mejor rankeadas**, **más populares** (likes + dislikes).  
  - Sistema de **likes/dislikes** (cada usuario solo puede dar uno).  
  - Búsqueda de películas por **regex** (empieza por o contiene el texto).  

###  Categorías
- Se manejan dentro del mismo documento de películas como texto (categoria).  
- La API puede devolver películas agrupadas por categorías.  

###  Reseñas
- Un usuario puede dejar **solo una reseña por película**.  
- Campos: usuario, texto, calificacion (1-10), fecha.  
- Posibilidad de **editar** o **eliminar** la reseña propia.  
- El promedio de calificaciones de una película se recalcula automáticamente (con un decimal).  

---

## Variables de entorno

En el archivo .env debes configurar:  

PORT=3000
DB_URI=mongodb://localhost:27017/peliculasDB
JWT_SECRET=tu_clave_secreta


## Cómo ejecutar

1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/harleyyefreycabralesvargas/Proyecto_Express_Backend_CabraleHarley_VeraSantiago
## Instalar dependencias:

npm install

Configurar variables de entorno en .env.

## Iniciar el servidor:

npm run inicio
El backend quedará disponible en:

http://localhost:3000
Documentación de la API
Las rutas y parámetros están documentados en Swagger, accesible en:

http://localhost:3000/doc
Ahí se encuentran ejemplos de uso y pruebas directas.


# [Video Sustentacion](https://drive.google.com/drive/folders/1RTSj7w7VOsqcRCBLAcYZzXMjznY5usDD?usp=sharing)

# [Requerimientos](https://docs.google.com/document/d/1CfLx0wNOE_qsAP5wHW44CTfcbQeDWR3OlmwcnzmSoMA/edit?usp=sharing)

# [Jira](https://arleycabralesvargas-1759112031482.atlassian.net/jira/software/projects/KAN/boards/1?atlOrigin=eyJpIjoiNjRmNjgwZmQwODU1NDU1MjlkYzI5NzA2MzNjMjcwZmYiLCJwIjoiaiJ9)
# [Fronted](https://github.com/harleyyefreycabralesvargas/Proyecto_Express_Fronted_CabralesHarley_VeraDavid)
