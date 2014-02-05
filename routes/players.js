var mongoose    = require('mongoose'),
    Player      = require('../models/players'),
    Game        = require('../models/games'),
    utils       = require('../utils'),
    astar       = require('../astar'),
    _           = require('underscore'),
    Q           = require('q');
exports.getAll = function (req, res) {
    res.json({
        'players' : [{ }]
    });
};
exports.getById = function (req, res) {
    var playerId = req.params.id;
    var player = {};
    res.json({
        'playerId'  : playerId,
        'player'    : player
    });
};
exports.move = function (req, res) {
    var playerId = req.params.id;
    var newX = req.body.x;
    var newY = req.body.y;
    Game.findOne()
    .exec(function (err, data) {
        if (data) {
            var team = (data.currentTeam === data.home._id) ? 'home' : 'away';
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
            _.each(tackleZones, function(position){
                var gridPosition = grid[position[0]][position[1]];
                if (_.isNumber(gridPosition)) {
                    grid[position[0]][position[1]]++;
                }
            });
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
            updateGame(conditions, update)
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
                res.json(results);
            }, function () {
                res.send(500, 'game update failed');
            });
        } else {
            res.send(500, 'no game found');
        }
    });
}
function updateGame (conditions, update) {
    var dfd = Q.defer();
    Game.update(conditions, update, function (err, numberAffected, raw) {
        err ? dfd.reject() : dfd.resolve();
    });
    return dfd.promise;
}