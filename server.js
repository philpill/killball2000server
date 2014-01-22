#!/bin/env node

var express     = require('express');
var fs          = require('fs');
var mongoose    = require('mongoose');
var teams       = require('./routes/teams.js');
var players     = require('./routes/players.js');
var games       = require('./routes/games.js');
var database    = require('./database');

var app = express();

app.get('/*', function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.get('/teams', teams.getAll);
app.get('/teams/:id', teams.getById);
app.get('/players', players.getAll);
app.get('/players/:id', players.getById);
app.post('/players/:id/move', players.move);
app.get('/games', games.getAll);

app.listen((process.env.OPENSHIFT_NODEJS_PORT || 8090), process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');