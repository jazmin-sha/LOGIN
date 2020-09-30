const Users = require('../models/user');
const express = require('express');
const sessions = require('express-session');
const routes = express.Router(); 



const ridirecttoWelcome = (req,res,next)=>{
    if(req.session.username){
        res.redirect('/admin/adminwelcome');
    }else{
        next();
    }
}



const login = (req,res,next)=>{
    if(!req.session.nameDB){
        res.redirect('/admin/admin')
    }else{ 
           next ()
}}


 const welcome= (req,res,next) => {
if(req.session.nameDB){
    res.redirect('/admin/adminwelcome')
}else{
    next()
}
}


routes.get('/',welcome,(req,res) => res.redirect('/admin/admin'));


routes.get('/admin',welcome,(req,res) => res.render('home'));


 
//adminreg
routes.get('/adminregister',ridirecttoWelcome,(req,res)=>{
    res.render('adminregister');
});
 


routes.get('/adminwelcome',login,(req,res,next) => {
    Users.find({}).lean().exec((err,data) => {
        res.render('adminwelcome',{users:data})
    })
      
})



const nameDB = "admin";
const passwordDB = "000"
routes.post("/home", (req, res) => {
    const { name, password } = req.body;
    if (name === nameDB && password === passwordDB) {
        req.session.nameDB = name;
        res.redirect('/adminwelcome')
    } else {
        res.redirect('/')
    }
});



routes.post('/adminlogout',(req,res) => { 

    req.session.destroy(err => {
        if(err) { 
            
            return res.redirect('/admin/adminwelcome')
        } 
        res.clearCookie("admincookie");
        res.redirect('/admin/admin')
        
    })
 }) 

 routes.get('/update/:id',(req, res) => {   
     const id = req.params.id
     Users.find({_id: id}).lean().exec((err, user)=>{
         if(user){
             res.render("update",{doc:user})
         }
     })
   
     })    
routes.post('/upload/:id',(req,res) => {
     const id = req.params.id
    
    const {username,phone} = req.body;
    const data = {
        username,
       
        phone        
    }
    Users.findByIdAndUpdate(id,data,(err,res)=>{ 
       
        if(err){
            console.log(err);
            
        }
        console.log(res);
    })
     
   
    res.redirect('/admin/adminwelcome')
}) 



routes.get('/delete/:id', (req, res) => {
    Users.findByIdAndDelete(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/admin/adminwelcome')
        }else{
            res.redirect('/admin/adminwelcome')
        }
    })
})

//admincreate

routes.post('/adminregister',(req,res)=>{
    const newUser = {
        
                username : req.body.username,
                password : req.body.password,
                phone : req.body.phone,
            }
    // Users.push(newUser);
    var newman = new Users(newUser);
    newman.save();
    res.redirect('/admin/adminwelcome');
});




module.exports = routes;
