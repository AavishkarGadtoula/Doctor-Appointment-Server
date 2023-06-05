const express = require("express")
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const { Login, User, Role,Day,Time } = new PrismaClient()
const {scheduleTime} = require("../../config/scheduleTime")
router.get("/", async (req, res) => {
    try {
        const role = await Role.findUnique({
            where: {
                type: "DOCTOR"
            }
        })
        res.json( await User.findMany({
            where: {
                roleId: role.id,
            },
            include: {
                login: {
                    select: {
                        email: true,
                    }
                }
            }
        }))
    } catch (err) {
        res.json([])
    }
})

router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const del = await User.delete({
            where: {
                id:id
            }
        })

        const lgn = await Login.findUnique({
            where: {
                id:del.loginId
            }
        })
        if (lgn) {
            await Login.delete({
                where: {
                    id:del.loginId
                }
            })
        }
        res.json (del);
    } catch (err) {
        res.json({
            status: "error",
            message:err.message
        })
    }
})

router.get("/:doctorId/getSchedule/:date", async (req, res) => {
    try {
        const { doctorId,date}= req.params
        const days = await Day.findMany({
            where: {
                userId: doctorId,
                day: date,
            
            },
            include: {
                times:true
            }
        });
        if (days.length >= 1) {
            res.json([...days[0].times])
        } else {
            const day = await Day.create({
                data: {
                    day: date,
                    userId: doctorId,
                }
            });
            const times = scheduleTime.map(t => {
                return { times: t, dayId: day.id}
            });
            const time1 =await Time.createMany({
                data: [...times]
            });
            const _day = await Day.findUnique({
                where: {
                    id: day.id,
                },
                include: {
                    times:true
                }
            })
            res.json(_day?.times);

        }

    } catch (err) { 
        console.log(err);
        res.json([]);
    }

})

router.post("/fixSchedule/:scheduleId/:userId", async (req, res) => {
    try {
        const { scheduleId,userId } = req.params;
        const time = await Time.findUnique({
            where: {
                id:scheduleId
            }
        })
        if (!time) throw Error("Invalid schedule");
        if (time.status == "booked") throw Error("Already Booked");
        const updatedTime = await Time.update({
            where: {
                id: scheduleId
            },
            data: {
                status: "booked",
                userId:userId,
            }
        });
        res.json({
            status: "success",
            data: {time:updatedTime}
        })
    } catch (err) { 
        console.log(err)
        res.json({
            status: "error",
            message:err.message
        })
    }

})

router.get("/getSchedule/:doctorId/:date", async (req, res) => {
    try {
        const { doctorId,date } = req.params;
        const day = await Day.findMany({
            where: {
                userId: doctorId,
                day:date
            }, include: {
                times: {
                    include: {
                        user:true
                    }
                },
            }
        })

        if (day.length==0) throw Error("Invalid schedule");
        res.json(day[0].times);
    } catch (err) { 
        console.log(err)
        res.json([])
    }

})


module.exports = router;