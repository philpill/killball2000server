var mongoose = require('mongoose');

module.exports = mongoose.model('players', new mongoose.Schema({

    name                : { type: String, required: true },
    number              : { type: Number },
    //position          : { type: ObjectId, ref: 'Position' },
    position            : { type: String },
    starPlayerPoints    : { type: Number },
    movement            : { type: Number },
    strength            : { type: Number },
    agility             : { type: Number },
    armour              : { type: Number },
    skills              : { type: Array },
    injuries            : { type: Array },
    isStarPlayer        : { type: Boolean },
    touchDowns          : { type: Number },
    //race              : { type: ObjectId, ref: 'Race' }
    race                : { type: String }

}));