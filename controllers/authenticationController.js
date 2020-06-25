const auth = require('../config/auth.js')
const users = require('../db_apis/users.js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function login(req, res, next) {
    try {
        let context = {}

        Object.keys(req.body).length && (context = req.body)
        Object.keys(req.query).length && (context = req.query)

        const user = await users.getUser(context.username) //choose new added user

        if (!user || !user.length) {
            res.status(400).send('No user found')
            return
        }

        let passwordIsValid = bcrypt.compareSync(context.password, user[0].password);

        if (!passwordIsValid) {
            res.status(401).send({
                auth: false,
                access_token: null
            })
            return
        }

        let access_token = jwt.sign({
                id: user[0].id
            },
            auth.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        res.status(200).send({
            auth: true,
            access_token: access_token,
            user: {
                name: user[0].name,
                username: user[0].username
            }
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

        if(oldUser.length) {
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
            res.status(500).send('Uncorrect data')
            return
        }

        let oldUser = await users.getUser(context.username)

        if (oldUser.length) {
            res.status(500).send('You are already registered')
            return
        }

        context.name = context.name
        context.username = context.username
        context.password = context.password
        context.birthday = context.birthday
        console.log(context)

        await users.insertNewUser(context)
        const user = await users.getUser(context.username) //choose new added user

        let access_token = jwt.sign({
                id: user.id
            },
            auth.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        res.status(200).send({
            auth: true,
            access_token: access_token,
            user: user
        });
    } catch (err) {
        next(err)
    }
}

module.exports.registration = registration;