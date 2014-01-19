#!/bin/env node

var express = require('express');
var fs      = require('fs');
var teams   = require('./routes/teams.js');
var app     = express();

app.get('/teams', teams.getAll);

app.listen((process.env.OPENSHIFT_NODEJS_PORT || 8090), process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');