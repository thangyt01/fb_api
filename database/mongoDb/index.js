let mongoose = require("mongoose");
let config = require('config');
let _ = require('lodash');

let username = _.get(config, 'mongoDB.username', 'root');
let password = _.get(config, 'mongoDB.password', 'password');
let host = _.get(config, 'mongoDB.host', 'localhost');
let port = _.get(config, 'mongoDB.port', 27017);
let database = _.get(config, 'mongoDB.database', 'database');
let parameter = _.get(config, 'mongoDB.parameter', 'authSource=admin');
// get Uri from config if exist

let uri;
let baseUri = _.get(config, 'mongoDB.uri', null);
if (baseUri) {
    uri = baseUri;
} else {
    uri = `mongodb://${username}:${password}@${host}:${port}/${database}?${parameter}`;
}

const connectMongo = async () => {
    await mongoose.connect(uri)
        .then(() => console.log(`========== mongoDB connected  uri: ${uri} ...`))
        .catch(e => console.log(`========== error connect MongoDB ${e}`));
}

connectMongo();