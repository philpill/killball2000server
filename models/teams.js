var mongoose = require('mongoose');
var players = require('./players');
var Schema = mongoose.Schema;

module.exports = mongoose.model('teams', new Schema({

    name        : { type: String, required: true },
    fanFactor   : { type: Number },
    treasury    : { type: Number },
    played      : { type: Number },
    won         : { type: Number },
    lost        : { type: Number },
    drawn       : { type: Number },
    rerolls     : { type: Number },
    players     : [{ type: Schema.Types.ObjectId, ref: 'players' }]

}));