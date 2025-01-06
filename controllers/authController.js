const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

const { User,registerValidation, loginValidation } = require("../model/authModel");

exports.changeUserDetail = async (req, res) => {
  try {
    const user = res.locals.user; // Kullanıcı bilgilerini al
    const { username, password } = req.body; // Güncellenmiş verileri al

    // Güncellenmiş verileri tutacak nesne
    let updateData = {};
    if (username) {
      console.log(username);
      updateData.name = username;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Şifreyi hash'le
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).redirect("/auth/settings");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
};

exports.postRegister = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "error", message: "Bu e-posta zaten kullanılmakta." });
    }

    const hashPass = await bcrypt.hash(req.body.password, 10);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPass,
    });

    res.status(201).redirect("/auth/login");
  } catch (error) {
    res.status(500).json({
      error: "error",
      message: "Server is failer :" + error,
    });
  }
};

exports.postLogin = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "E-posta veya şifre hatalı" });
    }

    const secretKey = process.env.SECRET_KEY;

    // Sadece gerekli bilgileri al
    const payload = {
      id: user._id,
      email: user.email,
      username: user.name,
      role: user.role,
    }; // Eklemek istediğin diğer alanlar

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.cookie("authToken", token, { httpOnly: true });

    setTimeout(() => {
      res.status(201).redirect("/");
    }, 3000);
  } catch (err) {
    return res.status(500).json({
      error: "error",
      message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    });
  }
};

exports.postLogout = async (req, res) => {
  res.clearCookie("authToken", { httpOnly: true, secure: true });

  // Kullanıcıyı giriş sayfasına yönlendir
  res.redirect("/auth/login");
};

exports.deleteUser = async (req, res) => {
  try {
    // Kullanıcıyı veritabanından sil
    const deletedUser = await User.findByIdAndDelete(req.body.id);

    // Eğer kullanıcı bulunamazsa
    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Başarılı silme işlemi için yanıt
    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Kullanıcı silinirken bir hata oluştu.",
      error: err.message,
    });
  }
};
