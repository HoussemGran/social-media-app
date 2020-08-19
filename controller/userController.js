
const uuid = require('uuid');
const db = require('../db');


exports.addUser = (req,res)=>{

   
    const username = req.body.username;
    const password = req.body.password;

    db.query("select * from user where username = ? and password = ?",[username,password],(err,results,fields)=>{

        var hunter;
        if(results.length>0){
            console.log(results[0].id);   
            hunter = req.session;
            hunter.username = username;
            hunter.userID = results[0].id;
            res.redirect("home");

        }else{

            const user = {id:uuid.v4() , username:req.body.username , password:req.body.password};

            db.query('insert into user set ?',user,(err,results,fields)=>{

               if(!err) res.redirect("home");
                else res.send(err.message);
        
            });
        }
    });
};

// show all users
exports.showUsers = (req,res)=>{
    const user = req.session.username;
    if(user){
    db.query('select * from user',(err,results,fields)=>{

        res.send(results);

    });
    }else res.redirect('login');

};

// show a specified user profile
exports.showUser = (req,res)=>{
    const user = req.session.username;
    if(user){
    const id = req.params.id;
    db.query("select * from user u , post p where p.user = u.id and u.id = ?",[id],(err,results,fields)=>{
        console.log(results);
        if(err) res.send(err.message);
        else if(results.length > 0)
         res.render("profile",{results:results , msg:null});
        else res.render("profile",{results : null , msg:"No posts Yet"});

    });
    }else res.redirect('login');

};

// show my profile taking advantage of sessions
exports.myProfile = (req,res)=>{

    
    const user = req.session.username;
    if(user){

    db.query("select * from user u , post p where p.user = u.id and u.username = ?",[user],(err,results,fields)=>{
        console.log(results);
        if(err) res.send(err.message);
        else if(results.length > 0)
         res.render("profile",{results:results , msg:null});
        else res.render("profile",{results : null , msg:"No posts Yet"});

    });
    }else res.redirect('login');

};



// show my friends
exports.showMyFriends = (req,res)=>{




};