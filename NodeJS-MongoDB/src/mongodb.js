// cargamos dotenv y lo configuramos, para poder usar las variables de entorno
const dotenv = require('dotenv');
dotenv.config();

// importamos MongoClient del driver oficial de MongoDB
const { MongoClient } = require('mongodb');

// leemos la URI desde el archivo .env
const uri = process.env.MONGODB_URI;  // en el ejercicio esta como: MONGODB_URLSTRING

// Creamos una instancia de MongoClient, esto significa que podemos interactuar con la base de datos
const client = new MongoClient(uri);

// funcion para conectar a la base de datos
async function connectToMongoDB() {
    try {
        await client.connect();
            console.log("Conectado a MongoDB");
        return client; // devolvemos el cliente si la conexion fue exitosa
    } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
        return null; // devolvemos null si la conexion fallo
    }
}

// funcion para desconectar de la base de datos
async function disconnectFromMongoDB() {
    try {
        await client.close();
            console.log("Desconectado de MongoDB");
    } catch (error) {
            console.error("Error al desconectar de MongoDB:", error);
    } finally {
        // finalmente cerramos el cliente. Este bloque se ejecuta siempre
        console.log("Manejo de conexión finalizado.");
    }
}

// Exportamos las funciones. Estas funciones se pueden usar en otros archivos
module.exports = {
    connectToMongoDB,
    disconnectFromMongoDB
};


