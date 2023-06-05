const express = require("express")
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
// const {bookAppointment} = require("../../Nodemailer/index")
const { Login, User, Role,Day,Time } = new PrismaClient()

router.get("/get-appointments/:userId", async(req, res) => {
    try {
        const schedule = await Time.findMany({
            where: {
                userId: req.params.userId
            },
            include: {
                day: {
                    include: {
                        user:true
                    }
                }
            }
        })

        // bookAppointment(initialSchedule.user.login.email,initialSchedule.user.fname,initialSchedule.day.user.fname+" "+initialSchedule.day.user.lname,initialSchedule.day.day);

        res.json(schedule)

     } catch (err) {
        res.json([])
     }
 })

 router.post("/cancle-appointments/:timeId", async(req, res) => {
     try {         
        const schedule = await Time.update({
            where: {
                id: req.params.timeId
            },
            data: {
                status: "open",
                userId:null,
            }
        })
        res.json({
            status: "success",
            data: {schedule}
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: "error",
            message:err.message
        })
     }
 })


module.exports = router;