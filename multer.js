// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const multer = require("multer");
// const path = require("path");


// const storage = multer.diskStorage({
//   destination: "./Assets/",
//   filename: function (req, file, cb) {
//     cb(null, "/" + uuidv4() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000000000 },
// }).array("files");

// // if the directory doesn't exist in the asset folder to upload file, create one
// const maintainDirectory = async (req, res, next) => {
  
//   next();
// };

// const uploadFiles = async (req, res, next) => {
//   try {
//     await maintainDirectory(req, res, () => {
//       upload(req, res, async () => {
//         next();
//       });
//     });
//   } catch (err) {
//       res.json({
//           error:err.message
//     });
//   }
// };
// module.exports = { uploadFiles,upload };
