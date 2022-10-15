'use strict';
const mongoose = require('mongoose');
/**
 * create connection from URI
 * @param {*} URI 
 * @returns 
 */
export function connectionFactory(URI) {
    try {
        const conn = mongoose.createConnection(URI, { useNewUrlParser: true });
        console.log("MongoConnect success, uri = ", URI);
        return conn;
    } catch (e) {
        console.log(`[MongoConnect] connect to URI false, ${e.getMessage()}`);
        throw new Error(e)
    }
};