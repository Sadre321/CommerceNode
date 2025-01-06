const { Category, categoryValidation } = require("../model/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Tüm kategorileri bul

    if (!categories.length) {
      return res.status(404).json({ message: "Kategori bulunamadı." }); // Eğer kategori yoksa
    }

    res.status(200).json(categories); // Kategorileri döndür
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Kategoriler alınırken bir hata oluştu.",
      error: err.message,
    });
  }
};

exports.postCategories = async (req, res) => {
  try {
    const newCategory = await Category.create({ name: req.body.kategori });
    // Başarılı yanıt döndür
    res.status(201).json({ message: "Kategori oluşturuldu.", newCategory }); // Düzeltme burada
  } catch (error) {
    res
      .status(401)
      .json({ message: "Kategori Oluşturulamadı", errorCode: 401 });
  }
};

exports.editCategories = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Eğer kategori bulunamazsa, uygun bir hata mesajı döndür
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Kategori bulunamadı.", errorCode: 404 });
    }

    // Başarılı yanıt döndür
    res
      .status(200)
      .json({ message: "Kategori başarıyla güncellendi.", updatedCategory });
  } catch (error) {
    res.status(500).json({
      message: "Kategori güncellenirken hata oluştu.",
      errorCode: 500,
    });
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    // Eğer kategori bulunamazsa, uygun bir hata mesajı döndür
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Kategori bulunamadı.", errorCode: 404 });
    }

    // Başarılı yanıt döndür
    res
      .status(200)
      .json({ message: "Kategori başarıyla silindi.", deletedCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kategori silinirken hata oluştu.", errorCode: 500 });
  }
};
