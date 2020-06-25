const mysql = require('mysql');
const dbConfig = require('../config/database.js');
let pool;

async function initialize() {
    pool = await mysql.createPool(dbConfig);
}

module.exports.initialize = initialize;

async function close() {
    await pool.close();
}

module.exports.close = close;

function simpleExecute(statement, binds=[]) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            // Use the connection
            connection.query(statement, binds, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) {
                    reject(err);
                }

                resolve(results)
            });
        });
    });
}

module.exports.simpleExecute = simpleExecute;