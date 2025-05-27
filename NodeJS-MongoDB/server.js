// importamos express y lo configuramos, para poder usar las funciones de express
const express = require('express');
const app = express();

// importamos las funciones del archivo mongodb.js
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb.js');
const { ObjectId } = require('mongodb');

// configuramos el puerto en el que se va a ejecutar el servidor
const PORT = process.env.PORT || 3008;




// ruta principal del servidor
app.get('/', (req, res) => {
    res.status(200).send('Bienvenido a la API de Frutas')
});







// ruta a /frutas, obtiene todas las frutas
app.get('/frutas', async (req, res) => {
    const client = await connectToMongoDB();
    const db = client.db('frutas');
    const frutas = await db.collection('frutas').find().toArray();

    if (!client) {
        res.status(500).send( 'Error al conectarse a MongoDB');
        return;
    }

    await disconnectFromMongoDB();
    res.status(200).json(frutas);
})

// segun ChatGPT y mejor practica, sin cerrar la conexion a cada rato
//  app.get('/frutas/:id', async (req, res) => { // /frutas/:id
//      try { // try-catch para manejar errores
//          const client = await connectToMongoDB(); // conectarse a la base de datos
//          const db = client.db('frutas'); // seleccionar la base de datos
//          const frutasCollection = db.collection('frutas'); // seleccionar la coleccion

//          const frutas = await frutasCollection.find().toArray(); // obtener todas las frutas

//          await disconnectFromMongoDB(); // opcional: si vas a mantener la conexion abierta, dejalo apagado // desconectarse de la base de datos
//          res.status(200).json(frutas); // devolver las frutas
//      } catch (error) { // si hubo un error
//          console.error('Error al obtener las frutas:', error); // imprimir el error
//          res.status(500).json({ error: 'Error al obtener las frutas' }); // devolver un error
//      }
// })







// busqueda por id. Busca por el campo id (numero)

app.get('/frutas/id/:id', async (req, res) => {
    const frutaId = parseInt(req.params.id);
    if (isNaN(frutaId)) {
        res.status(400).json({ mensaje: 'ID numérico no válido' });
        return;
    }

    const client = await connectToMongoDB();

    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }


    const db = client.db('frutas');
    const fruta = await db.collection('frutas').findOne({ id: frutaId });

    await disconnectFromMongoDB();

    if (fruta) {
        res.status(200).json(fruta);
    } else {
        res.status(404).json({ mensaje: 'Fruta no encontrada con ese ID numérico' });
    }
});



// busca por el campo _id (ObjectId)
app.get('/frutas/_id/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(400).json({ mensaje: 'ID de MongoDB no válido' });
        return;
    }

    const client = await connectToMongoDB();

    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }

    const db = client.db('frutas');
    const fruta = await db.collection('frutas').findOne({ _id: new ObjectId(id) });

    await disconnectFromMongoDB();

    if (fruta) {
        res.status(200).json(fruta);
    } else {
        res.status(404).json({ mensaje: 'Fruta no encontrada con ese _id' });
    }
});





// segun CHATGPT
// app.get('/frutas/:id', async (req, res) => {
//     try {
//         const client = await connectToMongoDB(); // conectarse a la base de datos
//         const db = client.db('frutas'); // seleccionar la base de datos
//         const frutasCollection = db.collection('frutas'); // seleccionar la coleccion

//         const id = req.params.id; // obtener el id de la peticion
//         const fruta = await frutasCollection.findOne({ _id: new ObjectId(id) }); // buscar la fruta

//         if (fruta) { // si la fruta fue encontrada
//             res.status(200).json(fruta); // devolver la fruta
//         } else { // si la fruta no fue encontrada
//             res.status(404).json({ error: 'Fruta no encontrada' }); // devolver un error
//         }
//     } catch (error) { // si hubo un error
//         console.error('Error al buscar fruta por ID:', error); // imprimir el error
//         res.status(500).json({ error: 'Error al buscar la fruta' }); // devolver un error
//     } finally { // finalmente
//         await disconnectFromMongoDB(); // opcional: si vas a mantener la conexion abierta, dejalo apagado // desconectarse de la base de datos
//     }
// });







// Ruta /frutas/nombre/:nombre. Busca frutas cuyo nombre contenga parcial o totalmente el valor informado. Se usa expresion regular
app.get('/frutas/nombre/:nombre', async (req, res) => { // esto es lo mismo que /frutas/nombre/:nombre

    const client = await connectToMongoDB(); // conectarse a la base de datos
    if (!client) { // si la conexion fallo
        res.status(500).send( 'Error al conectarse a MongoDB'); // devolver un error
        return; // y salir
    }   

    const nombrebuscado = req.params.nombre; // obtener el nombre de la peticion
    const db = client.db('frutas'); // seleccionar la base de datos
    const frutas = await db.collection('frutas').find({ // buscar frutas con nombre que contenga el valor informado
        nombre: new RegExp(nombrebuscado, 'i') // i es para que sea case insensitive. Esto significa que la busqueda es insensible a mayusculas y minusculas
    }).toArray(); // convertir el cursor en un array. Esto significa que se devolveran todas las frutas que cumplan con la busqueda

    await disconnectFromMongoDB(); // desconectarse de la base de datos
    res.status(200).json(frutas); // devolver las frutas

})


// Ruta / frutas/importe/:importe. Busca frutas con importe mayor o igual al indicado
app.get('/frutas/importe/:importe', async (req, res) => { // esto es lo mismo que /frutas/importe/:importe

    const client = await connectToMongoDB(); // conectarse a la base de datos
    if (!client) { // si la conexion fallo
        res.status(500).send( 'Error al conectarse a MongoDB'); // devolver un error
        return; // y salir
    }

    const importeMinimo = parseFloat(req.params.importe); // obtener el importe de la peticion. parseFloat convierte el string en un numero
    const db = client.db('frutas'); // seleccionar la base de datos
    const frutas = await db.collection('frutas').find({ // buscar frutas con importe mayor o igual al indicado
        importe: { $gte: importeMinimo } // $gte es para que sea mayor o igual
    }).toArray(); // convertir el cursor en un array

    await disconnectFromMongoDB(); // desconectarse de la base de datos
    res.status(200).json(frutas); // devolver las frutas
})






// escuchar peticiones en el puerto indicado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}, link: http://localhost:${PORT}`);
    // connectToMongoDB(); // no es necesario conectarse a la base de datos aqui si se conecta en cada ruta
});

// buenas practicas
// desconectarse de MongoDB al final de la app o si se cierra la app. Resumen: Sirve para desconectar MongoDB de forma segura cuando cerras el servidor. Evita dejar conexiones abiertas y posibles errores.
process.on('SIGINT', async () => { // si se recibe una señal de interrupcion
    console.log('Desconectando de MongoDB...');  // imprimir un mensaje
    await disconnectFromMongoDB(); // desconectarse de MongoDB
    process.exit(0); // salir
});
