var mongoose = require('mongoose');
var Player = require('../models/players');

exports.getAll = function (req, res) {
    res.json({
        "players" : [{ }]
    });
};

exports.getById = function (req, res) {

    var playerId = req.params.id;

    var player = {};

    res.json({

        "playerId"  : playerId,
        "player"    : player
    });
};

exports.move = function (req, res) {

    var playerId = req.params.id;

    var player = {};

    var originalX = 0;
    var originalY = 0;

    var newX = req.body.x;
    var newY = req.body.y;

    res.json({

        "playerId"  : playerId,
        "originalX" : originalX,
        "originalY" : originalY,
        "newX"      : newX,
        "newY"      : newY,
        "success"   : true
    });
}