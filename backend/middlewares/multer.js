import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

// ensure folder exists
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
destination: function (req, file, cb) {
return cb(null, uploadDir);
},

filename: function (req, file, cb) {
try {
const uniqueName =
Date.now() +
"-" +
Math.round(Math.random() * 1e9) +
path.extname(file.originalname || "");


  return cb(null, uniqueName);
} catch (err) {
  console.log("FILENAME ERROR:", err);
  return cb(null, "fallback-file");
}


},
});

const upload = multer({ storage });

export default upload;
