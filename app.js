
const express = require('express');
const sessions = require('express-session');
const exphbs = require('express-handlebars');
const { urlencoded } = require('express');

const PORT = process.env.PORT || 4000;

const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(sessions);


const app = express();

const Users = require('./models/user');
const router = require('./routes/routes');
const routes = require('./routes/adminroutes');


const MONGIDBURI = process.env.MONGIDBURI || 'mongodb://localhost/auth_demo';

mongoose.connect(MONGIDBURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});



app.use(express.urlencoded({extended : true}));

app.engine('handlebars',exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.use('/admin',sessions({
    name : 'admincookie',
    secret : 'secretkey',
    store:new mongoStore({mongooseConnection:mongoose.connection}),
    resave :false,
    saveUninitialized : false,
    cookie :{maxAge : 1000*60*60*24}
}));

app.use('/',sessions({
    name : 'usercookie',
    secret : 'secretkey',
    store:new mongoStore({mongooseConnection:mongoose.connection}),
    resave :false,
    saveUninitialized : false,
    cookie :{maxAge : 1000*60*60*24}
}));


app.use('/',router);
app.use('/admin',routes)

app.listen(PORT,()=>{console.log(`http://localhost:${PORT}`)});


