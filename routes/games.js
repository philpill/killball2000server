var mongoose = require('mongoose');
var Game = require('../models/games');
var Team = require('../models/teams');

exports.getAll = function (req, res) {

    res.json([data]);
};

exports.getById = function (req, res) {

    Game.findOne()
    .exec(function (err, data) {

        if (data) {

            res.json(data);

        } else {

            Team.find()
            .populate('players')
            .exec(function (err, data) {

                var game = new Game({

                    "name" : "test",
                    "home" : data[0].toObject(),
                    "away" : data[1].toObject()
                });

                game.save(function (err, data) {

                    res.json(data);
                });
            });

        }
    });
};