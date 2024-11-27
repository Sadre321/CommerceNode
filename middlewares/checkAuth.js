const jwt = require("jsonwebtoken");
const {User} = require("../model/authModel"); // Kullanıcı modelini ekleyin

const authenticationToken = async (req, res, next) => {
    const token = req.cookies.authToken;
    const secretKey = process.env.SECRET_KEY;

    if (!token) {
        return res.redirect("/auth/login");
    }

    try {
        // Token'ı doğrula
        const user = await jwt.verify(token, secretKey);
        req.user = user;

        // Kullanıcıyı veritabanından bul
        const foundUser = await User.findById(req.user.id);
        if (!foundUser) {
            return res.status(404).json({ error: "error", message: "Kullanıcı bulunamadı" });
        }

        // Kullanıcı bilgisini res.locals'a ekleyin
        res.locals.user = foundUser;

        // Bir sonraki middleware'e veya route'a geç
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: "error", message: "Yetkisiz erişim" });
    }
};

const checkAdmin = (req, res, next) => {
    const user = res.locals.user;

    // Kullanıcı bilgisi yoksa yetkisiz erişim hatası döndür
    if (!user) {
        return res.status(403).json({ message: "Yetkisiz erişim: Kullanıcı bulunamadı", error: 403 });
    }

    // Kullanıcının rolünü kontrol et
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Yetkisiz erişim: Admin yetkisi gerekli", error: 403 });
    }

    // Eğer tüm kontrolleri geçtiyse, bir sonraki middleware'e geç
    next();
};

module.exports = {authenticationToken,checkAdmin};
