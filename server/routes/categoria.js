const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');
const { aggregate, findByIdAndUpdate } = require('../models/categoria');
const { response } = require('./usuario');

// ==========================================
// Mostrar todas las categorías
// ==========================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});


// ==========================================
// Mostrar una catgoría por id
// ==========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El Id no es válido'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ==========================================
// Crear una nueva categoría
// ==========================================
app.post('/categoria', verificaToken, (req, res) => {

    // regresa la nueva categoría
    // req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// ==========================================
// Actualizar la descricpión de la categoaría
// ==========================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    // Categoria.findById(...Categoria..)

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==========================================
// Mostrar una catgoría por id
// ==========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // Solo un adm puede borrar la categoría
    // Categoria.findByIdandRemove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El id no existe' }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        });
    })
});
module.exports = app;