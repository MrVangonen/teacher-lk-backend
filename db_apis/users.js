const database = require('../services/database.js');
const bcrypt = require('bcrypt')

const baseQuery = `select * from users`;

async function find(context) {
    let query = baseQuery;
    const binds = [];

    if (context.student_id) {
        binds.push(context.student_id);

        query += `\nwhere student_id = ?`;
    }

    const result = await database.simpleExecute(query, binds);
    console.log(result)
    return result;
}

module.exports.find = find;

async function insertNewUser(context) {
    const binds = [];

    binds.push(context.username, bcrypt.hashSync(context.password, 8), context.name);

    let query = 'insert into users(username, password, name) values(?, ?, ?)'
    const result = await database.simpleExecute(query, binds);
    console.log(result)

    return result;
}

module.exports.insertNewUser = insertNewUser;

async function getUser(username) {
    const binds = [];

    binds.push(username);

    let query = 'select * from users where username = ?'
    const result = await database.simpleExecute(query, binds);

    return result;
}

module.exports.getUser = getUser;