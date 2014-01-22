var mongoose = require('mongoose');
var Game = require('../models/games');
var Team = require('../models/teams');

exports.getAll = function (req, res) {

    var games = [];

    Game.findOne().exec(function (err, data) {

        Team.find({
            '_id': { $in: [
                data.home._id,
                data.away._id
            ]}
        }).populate('players').exec(function (err, data) {

            var game = new Game({

                "name" : "test",
                "home" : data[0],
                "away" : data[1]
            });

            game.save(function (err, data) {

                res.json([data]);
            });
        });
    });
};

exports.getById = function (req, res) {

    var gameId = req.params.id;

    var game = {};

    res.json(game);
};
