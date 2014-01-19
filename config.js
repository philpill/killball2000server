var os = require('./config.openshift');

var local = require('./config.local');

module.exports = process.env.OPENSHIFT_APP_NAME ? os : local;