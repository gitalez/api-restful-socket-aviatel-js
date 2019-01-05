'use strict'

function getApp(req, res) {

    res.status(200).json({
        ok: true,
        mensaje: 'solicitud realizada correctamente'
    })
}

module.exports = { getApp };