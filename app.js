const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config(); // .env dosyasını yükle
require("./data/db"); // Veritabanı bağlantısını kur

const routes = require("./routes/indexRoute")
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

// Middleware ayarları
app.use(cookieParser());
app.use(express.json()); // Uygulama/json için gövde ayrıştırıcı
app.use(express.urlencoded({ extended: true })); // Uygulama/x-www-form-urlencoded için gövde ayrıştırıcı

// EJS görünüm motorunu ayarla
app.set("view engine", "ejs");
// Görünüm dosyalarının bulunduğu dizini ayarla
app.set("views", path.join(__dirname, 'views'));

// Public klasörünü statik dosya kökü olarak ayarla
app.use(express.static(path.join(__dirname, 'public')));

// Yönlendirme ayarları
app.use("/auth", authRoutes);
app.use("/",routes);
app.use("/", pageRoutes);

// PORT ayarını al ve dinlemeye başla
const PORT = 3000; // 3000 varsayılan port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
