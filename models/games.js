var mongoose = require('mongoose');

module.exports = mongoose.model('games', new mongoose.Schema({

    name : { type: String, required: true },
    home : {  },
    away : {  },
    turn : { type: Number, required: true },
    currentTeam : {  }

}));