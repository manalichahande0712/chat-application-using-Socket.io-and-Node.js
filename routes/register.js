const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router()
const userRegister = require('../models/user')

// Register new user
router.post('/', async (req, res, next) => {
    try{
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        //checking password and confirm password
        if(password === confirmpassword){

            // get user input
            const { username, email, password, confirmpassword } = req.body;

            if(!(username && email && password && confirmpassword)){
                res.status(400).send("All input field is required!");
            }

            //check if user already exist 
            const oldUser = await userRegister.findOne({email});

            if(oldUser){
                return res.status(403).render("User alredy exist!")
            }

            // encrypt user password usin bcrypt method
            encryptedPassword = await bcrypt.hash(password, 10);
            
            //create user in database
            const user = await userRegister({
                username,
                email : email.toLowerCase(), 
                password : encryptedPassword,
            })
            user.save()

            // // create jwt token
            // const token = jwt.sign(
            //     {
            //         user_id : user._id, email
            //     },
            //     process.env.TOKEN_KEY,
            //     {
            //         expiresIn: "2h",
            //     }
            // );
            
            // //save user token
            // user.token = token;
            
            //return new user 
            // res.status(201).json({
            //     message : 'Successfully Registered !',
            //     user
            // });
            res.render('index');
        }
        else{
            //response for password and confirm password not match
            res.status(401).send("Password not match!")
        }
    }
    catch(err){
        res.status(400).send('Invalid inputs')
        console.log(err);
    }
    //Registration logic end
});

module.exports = router