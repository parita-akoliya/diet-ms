const httpStatus = require('http-status');
import express from 'express';
import User from '../models/user';
import authHelper from '../helpers/auth-helpers';
import ResponseHelper from '../Utils/Response';

const AuthHelper = new authHelper();
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const config = require('../Utils/config');
const responseConfig = new ResponseHelper();
const VerifyToken = require('../validations/token.verify')
const jwt = require('jsonwebtoken');

authRouter.route('/login').post(async (req, res, next) => {
    try {
        let resp
        const user = await User.findOne({
            email: req.body.email
        }).exec();
        console.log(user);

        if (!user) {
            resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.INTERNAL_SERVER_ERROR);
            res.status(resp.status).send(resp)
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        console.log(passwordIsValid);

        if (!passwordIsValid) {
            resp = User.sendSuccessResponse({
                auth: false,
                token: null
            }, 'Unauthorized', httpStatus.UNAUTHORIZED);
            res.status(resp.status).send(resp)
        }
        var token = jwt.sign({
            id: user._id
        }, config.secret, {
            expiresIn: 86400
        });
        console.log(token);

        resp = responseConfig.sendSuccessResponse({
            auth: true,
            token: token,
            user: user
        }, 'Login Success', httpStatus.ACCEPTED)
        res.status(resp.status).send(resp)
    } catch (error) {
        let user = responseConfig.checkError(error);
        return next(res.status(user.status).json(user))
    }
});
authRouter.route('/signup').put(async (req, res, next) => {
    try {
        let attribute = await (new User(AuthHelper.createSignUpBody(req.body))).save();
        let resp = await responseConfig.sendSuccessResponse(attribute, 'Data Successfully Saved', httpStatus.CREATED)
        res.status(resp.status).send(resp)
    } catch (error) {
        let user = responseConfig.checkError(error);
        return next(res.status(user.status).json(user))
    }
}).get(VerifyToken, async (req, res, next) => {
    User.find({}, (err, users) => {
        res.json(users)
    })
});
authRouter.route('/delete/user').post(VerifyToken, async (req, res, next) => {
    const users = await User.deleteOne({
        userName: req.body.userName
    }).exec();
    let resp;
    if (!users) {
        resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.NOT_FOUND);
        res.status(resp.status).send(resp)
    }
    else {
        resp = User.sendSuccessResponse({}, 'User Delete Successfully', httpStatus.OK);
        res.status(resp.status).send(resp)
    }
});
authRouter.route('/me').get(VerifyToken, async (req, res, next) => {
    res.status(200).send({
        auth: true,
        message: 'Token is authenticated.'
    })
});
authRouter.route('/details').get(async (req, res, next) => {
    try {
        let resp
        const user = await User.findOne({
            _id: req.query.id
        }, { _id: 1, name: 1, gender: 1, weight: 1, height: 1, bmi: 1, age: 1 }).exec();
        console.log(user);

        if (!user) {
            resp = User.sendSuccessResponse({}, 'No User Found', httpStatus.INTERNAL_SERVER_ERROR);
            res.status(resp.status).send(resp)
        }
        resp = responseConfig.sendSuccessResponse(user, 'Details Success', httpStatus.ACCEPTED)
        res.status(resp.status).send(resp)
    } catch (error) {
        let user = responseConfig.checkError(error);
        return next(res.status(user.status).json(user))
    }
});
export default authRouter;