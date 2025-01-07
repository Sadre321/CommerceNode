const { Category} = require("../model/categoryModel");
const { Product } = require("../model/productModel");

exports.postProduct = async (req, res) => {
  try {
    // Formdan gelen verileri al
    const { name, description, category, price, color, size } = req.body;
    const files = req.files; // Multer ile yüklenen dosyalar

    // Dosyaların var olup olmadığını kontrol et
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Dosya yüklenmedi!" });
    }

    // Dosya yollarını ayarla
    const filePaths = files.map((file) =>
      path.join("/images/uploads", file.filename)
    );
    console.log(filePaths);

    // Colors ve sizes alanlarını dizi olarak ayarlayın
    const colorsArray = Array.isArray(color) ? color : [color];
    const sizesArray = Array.isArray(size) ? size : [size];
    console.log(colorsArray, sizesArray);

    // Ürünü oluştur
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      colors: colorsArray,
      sizes: sizesArray,
      images: filePaths, // Dosya yollarını burada kullan
    });

    await newProduct.save();

    // Başarılı yanıt
    res.status(201).redirect("http://localhost:3000/auth/products");
  } catch (error) {
    // Hata yönetimi
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu!", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // Ürünü veritabanından silin
    await Product.findByIdAndDelete(productId);

    res.status(204).send(); // Başarılı silme yanıtı
  } catch (err) {
    console.error(err);
    res.status(500).send("Ürün silme işlemi sırasında hata oluştu");
  }
};

exports.getProductsPage = async (req, res) => {
  const products = await Product.find();
  const categories = await Category.find();

  res.render("products", { page_name: "Products", products, categories });
};
