const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const registerRoute = require('../models/user');
const cookieParser = require("cookie-parser");

router.use(cookieParser())

router.post('/', async(req, res, next) => {
    try{
        const { email, password, username } = req.body;
        // console.log(email, password)

        //validate user input
        if(!(email && password)) {
            res.status(400).send('All input field is required!');
        }
        else{     
                //validate if user exist in database
                const user = await registerRoute.findOne({ email });
                // console.log(user)
                if (user && (await bcrypt.compare(password, user.password))) {

                    //create login token
                    const token = jwt.sign(
                        {
                           username: username
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn:"2h",
                        }
                    );
                    //save user token
                   
                    res.cookie("access_token", token)
                    res.render('chat')
                }
                else
                {
                    res.status(400).send("Error! \nYour Email-ID is not exist! Please register!")
                }
            }

    } 
    catch(err){
        console.log(err)
    }
})

router.get("/verify",async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.render('index')
  }
  try {
    const data = jwt.verify(token,process.env.TOKEN_KEY );
    const username = data.username
    console.log('Username :', username)
        res.json(username);
  } catch {
    return res.sendStatus(403);
  }
  });



module.exports = router