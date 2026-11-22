const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// POST - Crear nuevo producto
app.post('/productos', (req, res) => {
    // Saco los datos que vienen en el cuerpo de la peticion
    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const precio = req.body.precio

    // Si falta alguno de los tres campos, respondo con error 400
    // El precio lo comparo con undefined para que un 0 cuente como enviado
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    // Reto opcional: el precio tiene que ser un numero mayor que cero
    const precioNumero = parseFloat(precio)

    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un numero mayor que cero'
        })
    }

    // Genero un id nuevo buscando el id mas alto y sumandole uno
    let idMasAlto = 0

    productos.forEach(p => {
        if (p.id > idMasAlto) {
            idMasAlto = p.id
        }
    })

    const nuevoProducto = {
        id: idMasAlto + 1,
        nombre: nombre,
        descripcion: descripcion,
        precio: precioNumero
    }

    // Agrego el producto al arreglo y lo devuelvo con el codigo 201 (creado)
    productos.push(nuevoProducto)

    res.status(201).json(nuevoProducto)
})


// PUT - Actualizar producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // findIndex me da la posicion del producto, o -1 si no existe
    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const nombre = req.body.nombre
    const descripcion = req.body.descripcion
    const precio = req.body.precio

    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({
            mensaje: 'Los campos nombre, descripcion y precio son obligatorios'
        })
    }

    const precioNumero = parseFloat(precio)

    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({
            mensaje: 'El precio debe ser un numero mayor que cero'
        })
    }

    // Reemplazo los datos pero le dejo el mismo id que ya tenia
    productos[posicion] = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        precio: precioNumero
    }

    res.status(200).json(productos[posicion])
})


// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice saca el producto del arreglo y me lo devuelve dentro de una lista
    const eliminado = productos.splice(posicion, 1)

    res.status(200).json({
        mensaje: 'Producto eliminado',
        producto: eliminado[0]
    })
})


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
