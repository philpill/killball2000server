module.exports = {

    grid : {

        width   : 26,
        height  : 15
    },
    database : {

        url: process.env.OPENSHIFT_MONGODB_DB_HOST,
        port: process.env.OPENSHIFT_MONGODB_DB_PORT,
        user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
        pass: process.env.OPENSHIFT_MONGODB_DB_PASSWORD,
        db: process.env.OPENSHIFT_APP_NAME
    }
}