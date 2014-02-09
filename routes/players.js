var mongoose    = require('mongoose'),
    Player      = require('../models/players'),
    Game        = require('../models/games'),
    utils       = require('../utils'),
    astar       = require('../astar'),
    _           = require('underscore'),
    Q           = require('q');

var _req,
    _res;

function _updateGame (conditions, update) {
    var dfd = Q.defer();
    Game.update(conditions, update, function (err, numberAffected, raw) {
        err ? dfd.reject() : dfd.resolve();
    });
    return dfd.promise;
}

function _findGame (err, data) {
    if (!data) { _res.send(500, 'no game found'); }

    var playerId    = _req.params.id,
        newX        = _req.body.x,
        newY        = _req.body.y;

    var team = (data.home._id.equals(data.currentTeam.id)) ? 'home' : 'away';
    var currentTeam = data[team];
    var oppositionTeam = data[team === 'home' ? 'away' : 'home'];
    var grid = utils.createBlankGrid();
    var currentTeamPositions = utils.getGridsFromTeam(currentTeam);
    _.each(currentTeamPositions, function(position){
        grid[position[0]][position[1]] = 'x';
    });
    var oppositionTeamPositions = utils.getGridsFromTeam(oppositionTeam);
    _.each(oppositionTeamPositions, function(position){
        grid[position[0]][position[1]] = 'y';
    });
    var tackleZones = utils.getTackleZonesByTeam(oppositionTeam);

    // _.each(tackleZones, function(position){
    //     var gridPosition = grid[position[0]][position[1]];
    //     console.log(position);
    //     if (_.isNumber(gridPosition)) {
    //         grid[position[0]][position[1]]++;
    //     }
    // });
    // console.log(grid[12]);
    // console.log(grid[13]);
    var originalX;
    var originalY;
    // are new grids adjacent?
    // does player has moves left?
    _.each(currentTeam.players, function (player) {
        if (player._id.toString() === playerId) {
            originalX = player.x;
            originalY = player.y;
            player.x = newX;
            player.y = newY;
        }
    });
    var conditions = { '_id' : data._id };
    var update = {};
    update[team] = data[team];

    _updateGame(conditions, update)
    .then(function () {
        var results = {};
        results[team] = {
            players : [{
                '_id'       : playerId,
                'x'         : parseInt(newX, 10),
                'y'         : parseInt(newY, 10),
                'hasMoved'  : true
            }]
        };
        _res.json(results);
    }, function () {
        _res.send(500, 'game update failed');
    });
}

module.exports = {
    getAll : function (req, res) {
        res.json({
            'players' : [{ }]
        });
    },
    getById : function (req, res) {
        var playerId = req.params.id;
        var player = {};
        res.json({
            'playerId'  : playerId,
            'player'    : player
        });
    },
    move : function (req, res) {
        _req = req;
        _res = res;
        Game.findOne().exec(_findGame);
    }
}