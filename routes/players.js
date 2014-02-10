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
        err ? dfd.reject(err) : dfd.resolve(raw);
    });
    return dfd.promise;
}

function _getPopulatedGrid (currentTeam, oppositionTeam) {

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

    _.each(tackleZones, function(position){
        var gridPosition = grid[position[0]][position[1]];
        if (_.isNumber(gridPosition)) {
            grid[position[0]][position[1]]++;
        }
    });

    return grid;
}

function _findGame (err, data) {
    if (!data) { _res.send(500, 'no game found'); }

    var playerId    = _req.params.id,
        newX        = _req.body.x,
        newY        = _req.body.y;

    var team = (data.home._id.equals(data.currentTeam.id)) ? 'home' : 'away';
    var currentTeam = data[team];
    var oppositionTeam = data[team === 'home' ? 'away' : 'home'];

    var grid = _getPopulatedGrid(currentTeam, oppositionTeam);

    var originalX;
    var originalY;
    // are new grids adjacent?
    // does player has moves left?


    var player = _.find(currentTeam.players, function(player){ return player._id.toString() === playerId; });

    console.log(player);

    if (!player.attributes.moved || player.attributes.moved < player.attributes.movement) {
        originalX = player.x;
        originalY = player.y;
        player.x = newX;
        player.y = newY;
        player.attributes.moved = player.attributes.moved ? player.attributes.moved + 1 : 1;
    }

    var conditions = { '_id' : data._id };
    var update = {};
    update[team] = data[team];

    _updateGame(conditions, update)
    .then(function (data) {
        var results = {};
        results[team] = {
            players : [{
                '_id'       : playerId,
                'x'         : parseInt(player.x, 10),
                'y'         : parseInt(player.y, 10),
                'attributes': {
                    'moved' : parseInt(player.attributes.moved, 10)
                },
                'hasMoved'  : true
            }]
        };
        _res.json(results);
    }, function (err) {
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