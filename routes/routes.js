const Users = require('../models/user');
const express = require('express');
const sessions = require('express-session');
const router = express.Router(); 



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



const login = (req,res,next)=>{
    if(!req.session.nameDB){
        res.redirect('/')
    }else{ 
           next ()
}}



 const welcome= (req,res,next) => {
if(req.session.nameDB){
    res.redirect('/adminwelcome')
}else{
    next()
}
}  



router.get('/',ridirecttoWelcome,(req,res)=>{
    res.redirect('/login');
});

router.get('/welcome',protectHome,(req,res)=>{
   
    const username = req.session.username;
    res.render('welcome',{username});
});

router.get('/login',ridirecttoWelcome,(req,res)=>{
    res.render('login');
});

router.get('/register',ridirecttoWelcome,(req,res)=>{
    res.render('register');
});
    


//post methods

router.post('/register',(req,res)=>{
  
    const newUser = {
        
                username : req.body.username,
                password : req.body.password,
                phone : req.body.phone,
            }

    // Users.push(newUser);
    var newman = new Users(newUser);
    x = newman.save();
    res.redirect('/login');
});



router.post('/login',(req,res)=>{
  
    const username = req.body.username;
    const password = req.body.password;
   
    Users.findOne({username : username, password : password},(err,user)=>{
        console.log(user);
        if(user){
            req.session.username = user.username;
            res.redirect('/welcome');
        }else{
            const msg = 'Please Try Again....!!';
            res.render('login',{msg}); 
        }
    })
});
 


router.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.redirect('welcome');
        }
        res.clearCookie('usercookie');
        res.redirect('/');
    })
});


module.exports = router;


