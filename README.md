# 🍉 API de Frutas con Node.js + MongoDB

Este proyecto forma parte de las prácticas del Módulo 2.  
Consiste en una API REST desarrollada en Node.js que permite consultar información de frutas desde una base de datos MongoDB Atlas.

---

## 🧰 Tecnologías utilizadas

- 🔧 Node.js
- ⚡ Express.js
- 🍃 MongoDB Atlas
- 🛠️ Thunder Client (para pruebas)
- 🗂️ VS Code

---

## 🧪 Endpoints disponibles

| Método | Ruta                        | Descripción                                  |
|--------|-----------------------------|----------------------------------------------|
| GET    | `/`                         | Ruta de bienvenida 🌐                        |
| GET    | `/frutas`                   | Lista todas las frutas                       |
| GET    | `/frutas/id/:id`            | Busca fruta por ID numérico                  |
| GET    | `/frutas/_id/:id`           | Busca fruta por `_id` de MongoDB             |
| GET    | `/frutas/nombre/:nombre`    | Busca frutas por nombre parcial              |
| GET    | `/frutas/importe/:importe`  | Busca frutas por importe mínimo              |

---

## 🧪 Cómo probar la API

1. Asegurate de tener MongoDB Atlas conectado correctamente.
2. Ejecutá el proyecto con:

```bash
node server.js


3. Probá los endpoints desde:

🌐 Navegador

⚡ Thunder Client

---

📁 Estructura del proyecto

📦 NodeJS-MongoDB/
├── 📁 node_modules/ # Dependencias del proyecto (ignorado por git)
├── 📁 src/ # Conexión a MongoDB
│ └── mongodb.js
├── 📄 .env # Variables de entorno (ignorado por git)
├── 📄 .gitignore # Archivos y carpetas ignoradas por Git
├── 📄 package.json # Configuración del proyecto y dependencias
├── 📄 server.js # Servidor principal con rutas Express

---

✨ Autor
📛 Shadow-Itzal
📚 Proyecto educativo - Módulo 2 - Backend con Node.js

---

💡 Nota
Este proyecto es educativo y puede expandirse con métodos POST, PUT y DELETE para manejo completo de frutas 🍍🍓🍊.