import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var autoIncrement = require('mongoose-auto-increment');
const genderRoles = ['male', 'female'];
autoIncrement.initialize(mongoose.connection);
const userModel = new Schema({
    password: {
        type: String,
        match: /(?=^.{8,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/,
        required: true,
        minlength: 4,
        maxlength: 128,
    },
    height: {
        type: String,
        required: false,
        unique: false,
    },
    bmi: {
        type: String,
        required: false,
        unique: false,
    },
    weight: {
        type: String,
        required: false,
        unique: false,
    },
    age: {
        type: String,
        required: false,
        unique: false,
    },
    name: {
        type: String,
        required: false,
        unique: false,
    },
    updated_on: {
        type: String,
        required: false,
        unique: false,
    },
    created_on: {
        type: String,
        required: false,
        unique: false,
    },
    updated_by: {
        type: String,
        required: false,
        unique: false,
    },
    created_by: {
        type: String,
        required: false,
        unique: false,
    },
    created_by: {
        type: String,
        required: false,
        unique: false,
    },
    gender: {
        type: String,
        enum: genderRoles,
        default: 'male',
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: false,
        unique: true,
        trim: true,
        lowercase: true,
    }
});
userModel.pre('save', async function save(next) {
    let self = this;
    try {
        if (!this.isModified('password')) return next();
        const rounds = 10;
        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error);
    }
});

userModel.statics = {
}
userModel.plugin(autoIncrement.plugin, 'User');
export default mongoose.model('User', userModel)