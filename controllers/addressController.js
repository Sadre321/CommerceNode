const {
  User,
  Adress,
} = require("../model/authModel");

// Adres Ekleme İşlemi
exports.postAdress = async (req, res) => {
    try {
      const user = res.locals.user;
      const person = await User.findById(user._id);
  
      const newAddress = new Adress({
        user: user._id,
        title: req.body.addressType,
        adress: req.body.address,
      });
  
      const savedAddress = await newAddress.save();
      person.addresses.push(savedAddress._id);
      person.save();
  
      res
        .status(201)
        .json({ message: "Adres başarıyla eklendi.", address: savedAddress });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Adres eklenirken bir hata oluştu.",
        error: err.message,
      });
    }
  };
  
  // Kullanıcının adreslerini alma
  exports.getAdresses = async (req, res) => {
    try {
      const user = res.locals.user; // Kullanıcı bilgilerini al
      const adresses = await User.findById(user._id).populate("addresses"); // Kullanıcıya ait adresleri bul
  
      console.log(adresses);
  
      res.status(200).json(adresses); // Adresleri döndür
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Adresler alınırken bir hata oluştu.",
        error: err.message,
      });
    }
  };
  
  exports.deleteAdress = async (req, res) => {
    try {
      const deletedId = req.params.id;
      console.log("Silinecek ID:", deletedId);
  
      const deletedAddress = await Adress.findByIdAndDelete(deletedId);
  
      if (!deletedAddress) {
        return res.status(404).json({ message: "Adres bulunamadı." });
      }
  
      res
        .status(200)
        .json({ message: "Adres başarıyla silindi.", deletedAddress });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Sunucu hatası oluştu.", error: error.message });
    }
  };