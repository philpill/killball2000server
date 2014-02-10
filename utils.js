var config  = require('./config'),
    _       = require('underscore');
module.exports = {
    getOpposition : function (playerId) {
        var opposition;
        var homePlayers = this.home.players;
        var awayPlayers = this.away.players;
        var homeIds = _.pluck(homePlayers, '_id');
        var awayIds = _.pluck(awayPlayers, '_id');
        homeIds = _.map(homeIds, function (id) {
            return id.toString();
        });
        awayIds = _.map(awayIds, function (id) {
            return id.toString();
        });
        var isHomePlayer = _.contains(homeIds, playerId);
        var isAwayPlayer = _.contains(awayIds, playerId);
        if (isHomePlayer) {
            opposition = this.home;
        } else if (isAwayPlayer) {
            opposition = this.away;
        }
        return opposition;
    },
    getAdjacentGridsMatrix: function (x, y) {
        var grids = [
            [x-1, y-1], [x, y-1], [x+1, y-1],
            [x-1, y+0], [x+1, y+0],
            [x-1, y+1], [x, y+1], [x+1, y+1]
        ];
        // console.log(grids);
        return grids;
    },
    getGridsFromTeams: function(teams) {
        var grids = _.map(teams, function (team) {
            return this.getGridsFromTeam(team);
        }, this);
        return _.flatten(grids, true);
    },
    getGridsFromTeam: function (team) {
        var players = team.players
        var grids = _.map(players, function (player) {
            return [player.x, player.y];
        }, this);
        return grids;
    },
    getTackleZonesByTeam: function (team) {
        var players = team.players;
        var tackleZones = _.map(players, function (player) {
            // why are these x and y's sometimes strings?
            return this.getAdjacentGridsMatrix(parseInt(player.x, 10), parseInt(player.y, 10));
        }, this);
        var result = _.flatten(tackleZones, true);
        result[0] = _.uniq(result[0]);
        return result;
    },
    getPopulatedGrid: function (occupiedTiles) {
        var grid = this.createBlankGrid();
        for (var i = 0, j = occupiedTiles.length; i < j; i++) {
            var tile = occupiedTiles[i];
            grid[tile[0]][tile[1]] = 1;
        }
        return grid;
    },
    createBlankGrid: function () {
        var grid = [];
        for (var i = 0; i < config.grid.width; i++) {
            grid[i] = [];
            for (var j = 0; j < config.grid.height; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    },
    getTackleZoneGrid: function (gameTurnTeam, opposingTeam) {
        var grid = this.createBlankGrid();
        var tackleZones = this.getTackleZonesByTeam(opposingTeam);
        _.each(tackleZones, function (zone) {
            grid[zone[0]][zone[1]]++;
        });
        return grid;
    }
}