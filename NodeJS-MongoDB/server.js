// importamos express y lo configuramos, para poder usar las funciones de express
const express = require('express');
const app = express();

// importamos las funciones del archivo mongodb.js
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb.js');
const { ObjectId } = require('mongodb'); 
const { parse } = require('dotenv');

// configuramos el puerto en el que se va a ejecutar el servidor
const PORT = process.env.PORT || 3008;

app.use(express.json()); // para poder recibir datos en formato JSON segun ChatGPT


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

app.get('/frutas/id/:id', async (req, res) => { // esto es lo mismo que /frutas/id/14
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
app.get('/frutas/nombre/:nombre', async (req, res) => { // esto es lo mismo que /frutas/nombre/manzana

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
app.get('/frutas/importe/:importe', async (req, res) => { // esto es lo mismo que /frutas/importe/250

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



// .......................................
// Agregando POST - PUT - DELETE


// metodo POST. Sirve para crear frutas
app.post('/frutas', async (req, res) => { // esto es lo mismo que /frutas
    const nuevaFruta = req.body; // obtener la fruta de la peticion
        if (nuevaFruta === undefined) { // si la fruta es undefined. Undefined significa que no se envio ninguna fruta
            res.status(400). send('Error en el formato de datos a crear.'); // devolver un error
        }
    const client = await connectToMongoDB(); // conectarse a la base de datos
        if (!client) { // si la conexion fallo
            res.status(500).send('Error a conectarse a MongoDB') // devolver un error
        }

    const collection = client.db ('frutas').collection('frutas') // seleccionar la coleccion
        collection.insertOne(nuevaFruta) // insertar la nueva fruta
        .then(() => { // si se inserto la fruta
            console.log('Nueva fruta creada: '); // imprimir un mensaje
            res.status(201).send(nuevaFruta); // devolver la nueva fruta
        })
        .catch(error => { // si hubo un error
            console.error(error); // imprimir el error
        })
        .finally(() => { // finalmente
            client.close(); // cerrar la conexion
        });
});






// metodo PUT (update). Sirve para actualizar frutas
app.put('/frutas/id/:id', async (req, res) => { // esto es lo mismo que /frutas/id/21
    const id = req.params.id; // obtener el id de la peticion
    const nuevosDatos = req.body; // obtener la fruta de la peticion

    if (!nuevosDatos) { // si la fruta es undefined. Undefined significa que no se envio ninguna fruta
        res.status(400). send('Error en el formato de datos recibidos.'); // devolver un error
    }

    const client = await connectToMongoDB(); // conectarse a la base de datos
    if (!client) { // si la conexion fallo
        res.status(500).send('Error a conectarse a MongoDB') // devolver un error
    }

    const collection = client.db('frutas').collection('frutas'); // seleccionar la coleccion
    collection.updateOne({ id: parseInt(id) }, { $set: nuevosDatos }) // actualizar la fruta
    .then(() => { // si se actualizo la fruta
        console.log('Fruta modificada. '); // imprimir un mensaje
        res.status(200).send(nuevosDatos); // devolver la fruta actualizada
    })
    .catch(error => { // si hubo un error
        res.status(500).json({ error: 'Error al modificar la fruta' });
    })
    .finally(() => { // finalmente
        client.close(); // cerrar la conexion
    });
})



// metodo DELETE. Sirve para borrar frutas
app.delete('/frutas/id/:id', async (req, res) => { // esto es lo mismo que /frutas/id/21
    const id = req.params.id; // obtener el id de la peticion

    if (!req.params.id) { // si no se envio un id
        return res.status(400).send('El formato de datos es erroneo o invalido'); // devolver un error
    }

    const client = await connectToMongoDB(); // conectarse a la base de datos
    if (!client) { // si la conexion fallo
        return res.status(500).send('Error a conectarse a MongoDB') // devolver un error
    }

    client.connect() // conectarse a la base de datos
        .then(() => {
            const collection = client.db('frutas').collection('frutas'); // seleccionar la coleccion
            return collection.deleteOne({ id: parseInt(id) }); // borrar la fruta
        })
        .then((resultado) => { // si se borro la fruta
            if (resultado.deletedCount === 0) { // si no se borro la fruta
                res.status(404).send('No se encontro fruta con el ID proporcionado', id); // devolver un error
            } else { // si se borro la fruta
                console.log('Fruta eliminada correctamente. ');

                // ..........
                // -------    NO ME MUESTRA ESTO

                res.status(204).send('Fruta eliminada correctamente.'); // devolver un error 

                // ........
            }
        })
        .catch(error => { // si hubo un error
            res.status(500).send({ error: 'Se produjo un error al intentar eliminar la fruta' }); // devolver un error
        })
        .finally(() => { // finalmente
            client.close(); // cerrar la conexion
        });
});




// metodo PATCH. Sirve para actualizar parcialmente frutas
app.patch('/frutas/id/:id', async (req, res) => { // es lo mismo que /frutas/id/21
    const id = parseInt(req.params.id); // Convertimos el id recibido a número
    const camposActualizados = req.body; // Recibimos los campos que queremos modificar

    // Validación básica
    if (!camposActualizados || Object.keys(camposActualizados).length === 0) { // si no se envio ningun campo
        return res.status(400).send('No se enviaron campos para actualizar.'); // devolver un error
    }

    const client = await connectToMongoDB();
    if (!client) {
        return res.status(500).send('Error al conectarse a MongoDB');
    }

    const collection = client.db('frutas').collection('frutas'); // seleccionar la coleccion

    try {
        const resultado = await collection.updateOne( // actualizar la fruta
            { id: id }, // Filtro: fruta con ese id
            { $set: camposActualizados } // Solo actualiza los campos enviados
        );

        if (resultado.matchedCount === 0) { // si no se encontro la fruta
            res.status(404).send('Fruta no encontrada');
        } else {
            res.status(200).send('Fruta actualizada parcialmente');
        }
    } catch (error) {
        console.error('Error al hacer PATCH:', error);
        res.status(500).send('Error al actualizar parcialmente la fruta');
    } finally {
        client.close();
    }
});







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
