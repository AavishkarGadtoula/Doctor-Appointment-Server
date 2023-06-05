// import multer from "multer";


const express = require("express")
var cors = require('cors')
app = express();

require("dotenv").config();
const { PrismaClient }= require ('@prisma/client')

const { Login,User,Role,Time } = new PrismaClient()

// const upload = multer({ dest: 'uploads/'});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "public/assets");
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   });
//   const upload = multer({ storage });

app.get("/data", async (req, res) => {
    const data = await Time.findMany();
    res.json(data)
 })
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }))
app.use(express.json())
app.use("/api", require("./Routes/index"))



// app.post("/auth/register", upload.single("picture"), register);



//  app.get("/create-admin", async (req, res) => {
//     const _role = await Role.findUnique({
//         where: {
//             type: 'ADMIN'
//         }
//     })


//      res.json(await Login.create({
//          data: {
//              // datas for login
//              email: 'admin@gmail.com',
//              password: 'admin@gmail.com',
//              // aru data ne
//              user: {
//                  create: {
//                      // user datas
//                      fname: "admin",
//                      lname: "admin",
//                      roleId: _role.id,
//                      sex: "Male",
//                      age:25,
//                  }
//              }
//          }
//      }));
     
//  })


//  app.get("/create-role", async (req, res) => {
//      const data = await Role.createMany({
//         data: [
//              { type: 'DOCTOR' },
//              { type: 'PATIENT' },
//             { type: 'ADMIN' },
//           ],
//      });
//     res.json(data)
//  })

app.listen(process.env.PORT || 4000, () => { 
    console.log("server started at " + process.env.PORT || 4000)
})