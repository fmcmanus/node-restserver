const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: { message: 'No se ha seleccionado ningun archivo' },
                donde: 1
            });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                    tipo,
                    donde: 2
                }
            });
    }
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // Extensiones permitidas
    let extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                    ext: extension,
                    donde: 3
                }
            });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extension }`;
    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err,
                    donde: 4
                });

        // Aqui imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);

        } else {
            imagenProducto(id, res, nombreArchivo);

        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400)
                .json({
                    ok: false,
                    err: { message: 'El usuario no existe' },
                    donde: 5
                });
        }

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err,
                    donde: 6
                });
        }

        borraArchivo(usuarioBD.img, 'usuarios');
        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err,
                        donde: 7
                    });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });


        });



    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {
        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400)
                .json({
                    ok: false,
                    err: { message: 'El producto no existe' },
                    donde: 8
                });
        }

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err,
                    donde: 9
                });
        }

        borraArchivo(productoBD.img, 'productos');
        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err,
                        donde: 10
                    });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });


        });



    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;