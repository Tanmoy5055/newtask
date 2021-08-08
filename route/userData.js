const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const authUser = require('../middleware/authUser');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', authUser, async function(req, res) {
    res.render('dashboard', { message: req.flash('success') });
})

router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('success') });
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userSearch = await User.findOne({ email: email });
        // console.log(userSearch);
        if (!userSearch) {
            throw new Error('Invalid Details');
        }
       
        const isMatch = await bcrypt.compare(password, userSearch.password);
        // console.log(isMatch);

        if(!isMatch){
            throw new Error('Invalid Details')
        }
    
        const token  = await userSearch.genAuthToken();

        res.cookie('jwt', token,{
            maxAge: 1000*60,
            httpOnly: true
        });

        req.flash('success', 'Login Successfull');
        console.log('Login Successfull');
        res.send({
            success: 'Login Successfull'
        });
    } catch (error) {
        console.log(error);
        res.send({
            error: 'Login Failed'
        })
    }
})

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    let email = req.body.email;
    let checkUser = await User.findOne({ email });
    if (!checkUser) {
        let records = new User({
            email: req.body.email,
            fname: req.body.fname,
            lname: req.body.lname,
            password: req.body.password
        });
        try {
            const userRecords = await records.save();
            req.flash('success', 'Registerd Successfully');
            return res.send({
                success: "Registerd Successfully"
            });
        } catch {
            // req.flash('error', 'Registration Failed');
            return res.send({
                error: "Registration Failed"
            });
        }
    } else {
        // req.flash('alert', 'Email already exists');
        return res.send({
            alert: "Email already exists"
        });
    }
})

router.get('/products', (req, res) => {
    res.render('products');
});

router.get('/orders', (req, res) => {
    res.render('orders');
});

module.exports = router;