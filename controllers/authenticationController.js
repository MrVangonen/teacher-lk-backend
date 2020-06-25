const auth = require('../config/auth.js')
const users = require('../db_apis/users.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    v4: uuidv4
} = require('uuid');

async function login(req, res, next) {
    try {
        let context = {}

        Object.keys(req.body).length && (context = req.body)
        Object.keys(req.query).length && (context = req.query)

        const user = await users.getUser(context.username) //choose new added user

        if (!user || !user.length) {
            res.status(401).send({
                noUserFound: true
            })
            return
        }

        let passwordIsValid = bcrypt.compareSync(context.password, user[0].password);

        if (!passwordIsValid) {
            res.status(401).send({
                incorrectPassword: true
            })
            return
        }

        let access_token = jwt.sign({
                id: user[0].id
            },
            auth.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        delete user[0].password; // No password!

        res.status(200).send({
            auth: true,
            access_token: access_token,
            user: user[0]
        });
    } catch (err) {
        next(err)
    }
}

module.exports.login = login;

async function logout(req, res, next) {
    try {
        res.status(200).send({
            auth: false,
            access_token: null
        });
    } catch (err) {
        next(err)
    }
}

module.exports.logout = logout;

async function checkUsername(req, res, next) {
    try {
        let context = {}
        let payload = {}

        Object.keys(req.body).length && (context = req.body)
        Object.keys(req.query).length && (context = req.query)

        let oldUser = await users.getUser(context.username)

        if (oldUser.length) {
            payload.isUserRegistered = true
        } else {
            payload.isUserRegistered = false
        }

        res.status(200).send(payload);
    } catch (err) {
        next(err)
    }
}

module.exports.checkUsername = checkUsername;

async function registration(req, res, next) {
    try {
        let context = {}

        Object.keys(req.body).length && (context = req.body)
        Object.keys(req.query).length && (context = req.query)

        if (!(context.name && context.username && context.password && context.password.length >= 8)) {
            res.status(401).send({
                uncorrectData: true
            })
            return
        }

        let oldUser = await users.getUser(context.username)

        if (oldUser.length) {
            res.status(401).send({
                alreadyRegistered: true
            })
            return
        }

        //generate new uuid for user
        context.id = uuidv4()

        context.name = context.name
        context.username = context.username
        context.password = context.password
        context.position = context.position
        context.birthday = context.birthday

        await users.insertNewUser(context)
        const user = await users.getUser(context.username) //choose a new added user

        let access_token = jwt.sign({
                id: user.id
            },
            auth.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        delete user[0].password; // No password!

        res.status(200).send({
            auth: true,
            access_token: access_token,
            user: user[0]
        });
    } catch (err) {
        next(err)
    }
}

module.exports.registration = registration;