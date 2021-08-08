const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true
    },
    fname: {
        type: String,
        lowercase: true
    },
    lname: {
        type: String,
        lowercase: true
    },
    password: {
        type: String
    },
    tokens:[{
        token: {
            type: String
        }
    }]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.genAuthToken = async function() {
    const token = await jwt.sign({
        _id : this._id
    },'secret');

    this.tokens = this.tokens.concat({
        token: token
    });

    await this.save();
    return token;
}

const User = mongoose.model('shopdata', userSchema);
module.exports = User;