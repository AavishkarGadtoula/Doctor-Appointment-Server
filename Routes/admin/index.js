const express = require("express")
const router = express.Router();
const { PrismaClient }= require ('@prisma/client')
const { Time,Role } = new PrismaClient()
const { cancleAppointment } = require("../../Nodemailer/index")
router.get("/get-appointments", async (req, res) => {
    try {
        const appointment = await Time.findMany({
            where: {
                status: "booked"
            },
            include: {
                user: true,
                day: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        

        res.json([...appointment]);
    } catch (err) {
        res.json([])
    }
 
});

router.post("/cancle-appointments/:timeId", async (req, res) => {
    try {        
        const initialSchedule = await Time.findUnique({
            where: {
                id: req.params.timeId
            },
            include: {
                user: {
                    include: {
                        login: {
                            select: {
                                email: true
                            }
                        }
                    }
                },
                day: {
                    include: {
                        user: true
                    }
                }
            },


        });  
        const schedule = await Time.update({
            where: {
                id: req.params.timeId
            },
            data: {
                status: "open",
                userId:null,
            },
            include: {
                user: {
                    include: {
                        login: {
                            select: {
                                email:true
                            }
                        }
                    }
                }
            },
        })
        cancleAppointment(initialSchedule.user.login.email,initialSchedule.user.fname,initialSchedule.day.user.fname+" "+initialSchedule.day.user.lname,initialSchedule.day.day);
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
 
});
router.get("/get-patients", async (req, res) => {
    try {
        const role = await Role.findUnique({
            where: {
                type: "PATIENT"
            },
            include: {
                user: {
                    include: {
                        login: {
                            select:{email:true}
                        }
                    }
                },
            },
        });
        res.json([...role.user]);
    } catch (err) {
        res.json([])
    }
 
});

module.exports = router;

