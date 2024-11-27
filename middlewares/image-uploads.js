const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Maksimum dosya boyutunu belirle
const MAX_SIZE = 1 * 1024 * 1024; // 1 MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirPath = path.join(__dirname, "../public/images/uploads");
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) return cb(err);
            cb(null, dirPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya adı
    }
});

// Yükleme middleware'i
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_SIZE }, // Maksimum dosya boyutu
});

module.exports = upload;
