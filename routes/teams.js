var mongoose = require('mongoose');
var Teams = require('../models/teams');
var Players = require('../models/players');

exports.getAll = function(req, res) {

    Teams.find().populate('players').exec(function (err, teams) {

        res.json(teams);
    });
};

exports.getById = function (req, res) {
    res.json({
        "name" : "test"
    });
}