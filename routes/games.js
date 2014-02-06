"use strict";

var mongoose    = require('mongoose'),
    Game        = require('../models/games'),
    Team        = require('../models/teams'),
    Q           = require('q');

var _req,
    _res;

function _update (id, update) {
    var dfd = Q.defer();
    Game.findByIdAndUpdate(id, update, function (err, game) {
        err ? dfd.reject() : dfd.resolve(game);
    });
    return dfd.promise;
}

var _updateGame = function (err, data) {

    var update = { $inc: { turn: 1 }};

    _update(data._id, update)
    .then(function (game) {
        _res.json(game);
    }, function () {
        _res.send(500, 'game update failed');
    });
};

var _findGame = function (err, data) {
    if (data) {
        _res.json(data);
    } else {
        // new game!
        Team.find()
        .populate('players')
        .exec(_findTeam);
    }
};

var _findTeam = function (err, data) {
    var game = new Game({
        "name"  : "test",
        "home"  : data[0].toObject(),
        "away"  : data[1].toObject(),
        "turn"  : 0,
        "currentTeam" : {
            "id"        : data[0]._id,
            "isHome"    : true
        }
    });
    game.save(_saveGame);
};

var _saveGame = function (err, data) {
    _res.json(data);
};

var games = {

    getAll : function (req, res) {
        res.json([data]);
    },
    update : function (req, res) {
        _req = req;
        _res = res;
        Game.findOne().exec(_updateGame);
    },
    getById : function (req, res) {
        _req = req;
        _res = res;
        Game.findOne().exec(_findGame);
    }
}

module.exports = games;
