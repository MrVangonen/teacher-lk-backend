const database = require('../services/database.js');

const baseQuery = `select * from students`;

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