# Mi primer archivo Markdown

Hola, esto es **negrita**, *cursiva* y un [enlace a Google](https://www.google.com)

## Lista de cosas
- Manzana
- Bananas
- Uvas

## Codigo
'''js
console.log ("Hola mundo!")

.......................

Para ver la vista previa hay que apretar ctrl + K, soltar, V (esto va a mostrar una vista previa al costado)

Otra opcion es ctrl + shift + V, y luego lo pones doble pantalla para verlo al costado

........................

# Titulo de primer nivel
## Titulo de segundo nivel
### Titulo de tercer nivel
#### Titulo de cuarto nivel
##### titulo de quinto nivel
###### Titulo de sexto nivel

-------------
## El lenguaje Markdown

Este es un texto con __formato negrita__.

Este es un texto con _formato cursiva_.

Este es un texto con ___formato combinado de negrita y cursiva___.

Este es un texto con **formato negrita**.

Este es un texto con *formato cursiva*.

Este es un texto con ***formato combinado de negrita y cursiva***.

Este es un texto con __formato negrita__

<u>texto subrayado por defecto</u>

> Code, Eat, Sleep, Reap (cita breve)

### Listado de tareas 21-03-2023
- [x] Consttruccion del servidor web Express
- [x] Definicion de las rutas y metodos HTTP
- [x] Integracion con la base de datos Mongo DB
- [x] Desarrollo de la logica de cada metodo HTTP
- [ ] control de errores al utilizar cada metodo HTTP
- [ ] Integracion de token a las peticiones HTTP

............................

| PETICION | URL | DESCRIPCION |
| :---------: | ----- | --------|
| GET | [/frutas](/frutas) | Obtener todas las frutas |
| POST | [/frutas](/frutas) | Grabar una nueva fruta

------------

### Agregar codigo:

    frutas.forEach(fruta => console.log(fruta))


```
const resultado = frutas.filter(fruta => fruta.stock > 50)
```

```javascript
    {
        imagen: ":)".
        nombre: 'Dragon Fruit',
        precio: 1400,
        stock: 95
    }

    // El id no es necesario informarlo
    // el servidor se ocupa de resolverlo
```
![aprende Markdown](/NodeJS-MongoDB/img/logo3.png 'texto o tooltip sobre la imagen')

https://www.mediachicas.org/

[Visitar Mediachicas](https://mediachicas.org)

- [El lenguaje de Markdown](#el-lenguaje-markdown)
  - [Indice de contenidos](#indice-de-contenido)
  - [Diagrama de flujo con Markdown y mermaid](#diagrama-de-flujo-con-markdown-y-mermaid)
  - [Peticiones HTTP:](#peticiones-http)
      - [Metodo POST](#metodo-post)
      - [metodo PATCH](#metodo-patch)

