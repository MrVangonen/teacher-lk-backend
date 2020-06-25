const students = require('../db_apis/students.js')

async function get(req, res, next) {
    try {
        const context = {}
        context.student_id = parseInt(req.params.student_id, 10)
        const rows = await students.find(context)

        if (req.params.student_id) {
            if (rows.length === 1) {
                res.status(200).json(rows[0])
            } else {
                res.status(404).end()
            }
        } else {
            res.status(200).json(rows)
        }
    } catch (err) {
        next(err)
    }
}

module.exports.get = get;