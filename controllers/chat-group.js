'use strict'

let  ChatGroup = require('../models/chat-group');

/////////////////////////////////////////////////////
//
// metodo : post
// crearGrupo : obtener un control mediante su Id
//
/////////////////////////////////////////////////////
// en post man : http://localhost:3000/api/crear-grupo


function crearGrupo(req, resp) {

    let chatGroup = new ChatGroup({

        name: 'Grupo general'
    });

    chatGroup.save((err, groupStored) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al crear el grupo general',
                error: err
            });
        }
        if (!groupStored) {

            return resp.status(404).json({
                ok: false,
                error: err
            });
        };

        resp.status(201).json({
            ok: true,
            grupo: groupStored
        });

    });

    let chatGroup2 = new ChatGroup({

        name: 'Grupo ionic'
    });

    chatGroup2.save((err, groupStored) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: 'error al crear el grupo ionic',
                error: err
            });
        }
        if (!groupStored) {

            return resp.status(404).json({
                ok: false,
                error: err
            });
        };

        resp.status(201).json({
            ok: true,
            grupo: groupStored
        });

    });

}

function getGroups(req, resp) {

    ChatGroup.find()
        .exec((err, chatGroup) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    grupos: 'error al devolver los grupos',
                    error: err
                })
            }

            if (!chatGroup) {
                return resp.status(404).json({
                    ok: false,
                    message: 'no hay grupos'
                })
            }

            ChatGroup.countDocuments({}, (err, conteo) => {

                resp.status(200).json({ // ok 
                    ok: true,
                    grupos: chatGroup,
                    total: conteo
                })
            })
        })
};

function getGroup(req, resp) {

    var getGroupId = req.params.id;

    ChatGroup.findById(getGroupId, (err, group) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                message: `no se encuentra el grupo con el id: ${getGroupId}`
            });
        }
        if (!group) {

            return resp.status(404).json({
                ok: false,
                message: 'no existe este grupo'
            });
        }
        resp.status(200).json({
            ok: true,
            message: 'grupo encontrado',
            grupo: group
        })
    });

}

module.exports = {

    crearGrupo,
    getGroups,
    getGroup
};