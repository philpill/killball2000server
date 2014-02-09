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

function _updateGame (err, data) {

    var update = { $inc: { turn: 1 }, currentTeam : {}};

    update.currentTeam.isHome = data.currentTeam.isHome ? false : true;

    var homeAway = update.currentTeam.isHome ? 'home' : 'away';

    update.currentTeam.id = data[homeAway]._id;

    _update(data._id, update)
    .then(function (game) {
        _res.json(game);
    }, function () {
        _res.send(500, 'game update failed');
    });
};

function _findGame (err, data) {
    if (data) {
        _res.json(data);
    } else {
        // new game!
        Team.find()
        .populate('players')
        .exec(_findTeam);
    }
};

function _findTeam (err, data) {
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

function _saveGame (err, data) {
    _res.json(data);
};

module.exports = {
    getAll : function (req, res) {
        _req = req;
        _res = res;
        Game.find().exec(_findGame);
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