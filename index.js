const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');

app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        console.log(file.fieldname)
        console.log(file.originalname)
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const fileSize = 2 * 1000 * 1000;
const fileType = /jpg|jpeg|png/;
const upload = multer({
    storage: storage,
    limits: {
        fileSize: fileSize
    },
    fileFilter: function (req, file, cb) {
        const isFileTypeAllowed = fileType.test(path.extname(file.originalname).toLowerCase());
        if (isFileTypeAllowed) {
            cb(null, true);
        } else {
            cb(new Error("File format or size is not matching"), false);
        }
    }
}).single('pic');

app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/upload', (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            res.send(err.message);
        } else {
            res.send("Image submitted successfully");
        }
    });
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});
