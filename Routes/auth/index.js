// const {uploadFiles,upload} = require("../../multer")

const express = require("express")
const router = express.Router();
const { PrismaClient }= require ('@prisma/client')
const { Login,User,Role } = new PrismaClient()
var jwt = require('jsonwebtoken');
const { application } = require("express");


router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        const login = await Login.findUnique({
            where: {
                email: email,
            },
            include: {
                user:true
            }
        })
        if (!login) throw Error("User not found")
        if(login.password!= password) throw Error("Password didn't match")
        
        // generate token
        
        var token = jwt.sign({id:login.user.id}, 'secret', { expiresIn: "1w" });
        res.json({
            status: "success",
            data: {token:token}
        })
      
    } catch (err) { 
        console.log(err)

        res.json({
            status: "error",
            message:err.message
        })
    }
  
})
router.post("/register", async  (req, res, next) => {
    try {
        // console.log(req.files, req.body, "here",req.file)
        
        const { email, password, firstName, lastName, middleName, field, experience, address, phone, role, sex, age
            
        } = req.body;
        if(req.file) profilePic = req.file.path;
        
        const _role = await Role.findUnique({
            where: {
                type: role
            }
        })
        const register = await Login.findUnique({
            where: {
                email:email
            }
        })

        if (register) throw Error("Email already register");

        await Login.create({
            data: {
                // datas for login
                email: email,
                password: password,
                // aru data ne
                user: {
                    create: {
                        // user datas
                        fname: firstName,
                        mname: middleName,
                        lname: lastName,
                        field: field,
                        experience: experience,
                        address: address,
                        phone: phone,
                        roleId: _role.id,
                        sex: sex,
                        age: age,
                        // profilePic: profilePic,
                    }
                }
            }
        })

        res.json({
            status: "success",
            data: {}
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: "error",
            message:err.message
        })
    }
})

router.post("/verify-token", async(req, res) => {
    
    try { 
        const { token } = req.body;
        var userInfo = jwt.verify(token, 'secret');
        const user = await User.findUnique({ where: { id: userInfo.id }, include: {role:true} })
        if (!user) throw Error("Invalid token");
        res.json({
            status: "success",
            data: user
        })
    } catch(err) { 
        res.json({
            status: "error",
            message:err.message
        })
    }
})

module.exports = router;