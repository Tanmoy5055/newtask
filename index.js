const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
//flash msg
const flash = require('connect-flash');
const session = require('express-session');
const userData = require('./route/userData');
const mongoose = require('mongoose');
const db = 'mongodb+srv://tanmoy:sarkar@123@cluster0.fr728.mongodb.net/directory?retryWrites=true&w=majority';

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
},
    function(err){
        if(err){
            console.error('DB connection Failed')
        } else {
            console.error('DB connection Successfully')
        }
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cookieParser());
app.use(express.json());

app.use(flash());

app.use(session({
    secret: 'nodejs',
    cookie: {maxAge: 1000*6},
    resave: false,
    saveUninitialized: false
}));



app.use(userData);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Server is running on localhost " +PORT);
})