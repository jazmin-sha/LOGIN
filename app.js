
const express = require('express');
const sessions = require('express-session');
const exphbs = require('express-handlebars');
const { urlencoded } = require('express');
const PORT = process.env.PORT || 3000;


const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(sessions);
const app = express();
const Users = require('./models/user');

const MONGIDBURI = process.env.MONGIDBURI || 'mongodb://localhost/auth_demo';

mongoose.connect(MONGIDBURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});



app.use(express.urlencoded({extended : true}));

app.engine('handlebars',exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.use(sessions({
    name : 'sid',
    secret : 'secretkey',
    store:new mongoStore({mongooseConnection:mongoose.connection}),
    resave :false,
    saveUninitialized : false,
    cookie :{maxAge : 1000*60*60*24}
}));



const ridirecttoWelcome = (req,res,next)=>{
    if(req.session.username){
        res.redirect('/welcome');
    }else{
        next();
    }
}



const protectHome = (req,res,next)=>{
    if(!req.session.username){
        res.redirect('/login');
    }else{
        next();
    }
}

app.get('/',ridirecttoWelcome,(req,res)=>{
    res.redirect('/login');
});



app.get('/welcome',protectHome,(req,res)=>{
   
    const username = req.session.username;
    res.render('welcome',{username});
});




app.get('/login',ridirecttoWelcome,(req,res)=>{
    res.render('login');
});

app.get('/register',ridirecttoWelcome,(req,res)=>{
    res.render('register');
});



//post methods

app.post('/register',(req,res)=>{
    const newUser = {
        
                username : req.body.username,
                password : req.body.password,
                phone : req.body.phone,
            }
    // Users.push(newUser);
    var newman = new Users(newUser);
    newman.save();
    res.redirect('/login');
});



app.post('/login',(req,res)=>{
  
    const username = req.body.username;
    const password = req.body.password;
   
    Users.findOne({username : username, password : password},(err,user)=>{
        console.log(user);
        if(user){
            req.session.username = user.username;
            res.redirect('/welcome');
        }else{
            const msg = 'Invalid Password';
            res.render('login',{msg}); 
        }
    })
});
 


app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.redirect('welcome');
        }
        res.clearCookie('sid');
        res.redirect('/');
    })
});



app.listen(PORT,()=>{console.log(`http://localhost:${PORT}`)});
