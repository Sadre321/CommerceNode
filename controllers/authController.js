const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const { User, registerValidation ,loginValidation,Adress, Orders } = require("../model/authModel");
const { Category,categoryValidation } = require("../model/categoryModel");
const {Product} = require("../model/productModel");

exports.getLoginPage = (req, res) => {
    res.render("login", { page_name: "Login" })
};

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

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        res.status(200).redirect("/auth/settings");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bir hata oluştu.', error: error.message });
    }
};



exports.getRegisterPage = (req, res) => {
    res.render("register", { page_name: "Register" })
};

exports.getUsersPage = async(req, res) => {
    try {
        const users = await User.find(); 

        res.render("users", { page_name: "Users",users })
    } catch (error) {
        console.log(error);
    }
};

exports.getCategoriesPage = async(req, res) => {
    const categories = await Category.find();

    res.render("categories", { page_name: "Categories",categories })
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Tüm kategorileri bul

        if (!categories.length) {
            return res.status(404).json({ message: "Kategori bulunamadı." }); // Eğer kategori yoksa
        }

        res.status(200).json( categories ); // Kategorileri döndür
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Kategoriler alınırken bir hata oluştu.", error: err.message });
    }
};

exports.postCategories = async (req, res) => {
    try {
        const newCategory = await Category.create({ name: req.body.kategori });
        // Başarılı yanıt döndür
        res.status(201).json({ message: "Kategori oluşturuldu.", newCategory }); // Düzeltme burada
    } catch (error) {
        res.status(401).json({ message: "Kategori Oluşturulamadı", errorCode: 401 });
    }
};

exports.editCategories = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Eğer kategori bulunamazsa, uygun bir hata mesajı döndür
        if (!updatedCategory) {
            return res.status(404).json({ message: "Kategori bulunamadı.", errorCode: 404 });
        }

        // Başarılı yanıt döndür
        res.status(200).json({ message: "Kategori başarıyla güncellendi.", updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Kategori güncellenirken hata oluştu.", errorCode: 500 });
    }
};

exports.deleteCategories = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        // Eğer kategori bulunamazsa, uygun bir hata mesajı döndür
        if (!deletedCategory) {
            return res.status(404).json({ message: "Kategori bulunamadı.", errorCode: 404 });
        }

        // Başarılı yanıt döndür
        res.status(200).json({ message: "Kategori başarıyla silindi.", deletedCategory });
    } catch (error) {
        res.status(500).json({ message: "Kategori silinirken hata oluştu.", errorCode: 500 });
    }
}

exports.postProduct = async (req, res) => {
    try {
        // Formdan gelen verileri al
        const { name, description,category,price, color, size } = req.body;
        const files = req.files; // Multer ile yüklenen dosyalar

        // Dosyaların var olup olmadığını kontrol et
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Dosya yüklenmedi!' });
        }

        // Dosya yollarını ayarla
        const filePaths = files.map(file => path.join( '/images/uploads', file.filename));
        console.log(filePaths);

        // Colors ve sizes alanlarını dizi olarak ayarlayın
        const colorsArray = Array.isArray(color) ? color : [color];
        const sizesArray = Array.isArray(size) ? size : [size];
        console.log(colorsArray,sizesArray);

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
        res.status(500).json({ message: 'Bir hata oluştu!', error: error.message });
    }
};

exports.deleteProduct=async (req, res) => {
    const productId = req.params.id;
  
    try {
      // Ürünü veritabanından silin
      await Product.findByIdAndDelete(productId);
  
      res.status(204).send(); // Başarılı silme yanıtı
    } catch (err) {
      console.error(err);
      res.status(500).send('Ürün silme işlemi sırasında hata oluştu');
    }
};

exports.getProductsPage = async(req, res) => {
    const products = await Product.find();
    const categories = await Category.find();

    res.render("products", { page_name: "Products",products,categories });
};

exports.getOrdersPage = (req, res) => {
    res.render("orders", { page_name: "Orders" })
};

exports.getUserSettingsPage =async(req,res)=>{
    const user = res.locals.user;

    const {favorites,addresses} = await User.findById(user._id).populate("favorites").populate("addresses");

    res.render("settings",{page_name:"Settings",user,addresses,favorites})
};

exports.getUserMarketPage = async (req, res) => {
    const user = res.locals.user;
    try {
        const orders = await User.findById(user._id)
            .populate({
                path: 'orders',
                populate: {
                    path: 'product' // Burada product'ı populate ediyoruz
                }
            });

        // Toplam fiyatı hesaplayalım
        let totalPrice = 0;

        if (orders && orders.orders) {
            orders.orders.forEach(order => {
                console.log('Sipariş ID:', order._id);
                console.log('Ürün:', order.product);
                console.log('Renk:', order.color);
                console.log('Beden:', order.size);
                console.log('Miktar:', order.quantity);

                // Eğer ürün fiyatı varsa toplam fiyata ekleyelim
                if (order.product && order.product.price) {
                    totalPrice += order.product.price * order.quantity;
                }
            });
        } else {
            console.log('Sipariş bulunamadı');
        }

        if (!orders) {
            return res.status(404).json({ message: "Sipariş bulunamadı" });
        }

        // Toplam fiyatı frontend'e gönder
        res.render("market", { page_name: "Market", user, orders, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    }
};

exports.removeCart = async (req, res) => {
    try {
        const  orderId  = req.params.id; // Silinecek siparişin ID'si

        const user = res.locals.user; // Kullanıcının bilgileri
        const person = await User.findById(user._id).populate('orders'); // Kullanıcıyı siparişleri ile birlikte al

        if (!person) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı", error: 401 });
        }

        person.orders.pull(orderId);

        // Siparişi veritabanından kaldır
        await Orders.findByIdAndDelete(orderId);

        // Kullanıcıyı güncelle
        await person.save();

        return res.status(200).json({ message: "Sipariş başarıyla silindi", orders: person.orders });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    }
};

exports.postFavorite = async (req, res) => {
    const user = res.locals.user;
    try {
        const person = await User.findById(user._id);
        if (!person) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        // Ürünü favorilere ekle
        person.favorites.push(req.body.productId);

        // Değişiklikleri kaydet
        await person.save();

        res.status(200).json({ message: "Ürün favorilere eklendi", favorites: person.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    }
};

exports.removeFavorite = async (req, res) => {
    const user = res.locals.user;
    try {
        const person = await User.findById(user._id);
        if (!person) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        // Ürünü favorilere ekle
        person.favorites.pull(req.body.productId);

        // Değişiklikleri kaydet
        await person.save();

        res.status(200).json({ message: "Ürün favorilere kaldırıldı", favorites: person.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    }
};


exports.postCart = async (req, res) => {
    try {
        const { id,color, size, quantity } = req.body; // 'id' çıkarıldı

        const user = res.locals.user; // Kullanıcının bilgileri
        const person = await User.findById(user._id);

        if (!person) {
            return res.status(401).json({ message: "Kullanıcı bulunamadı", error: 401 });
        }

        const newOrder = await Orders.create({
            user: user._id,
            product: id, // Eğer id gerekli ise bu şekilde eklenebilir
            color: color,
            size: size,
            quantity: quantity, // Quantity alanını eklemeyi unutmayın
        });

        // Kullanıcının siparişlerini ekle
        person.orders.push(newOrder._id); // Siparişi kullanıcının siparişlerine ekleyin

        // Kullanıcıyı güncelle
        await person.save();

        return res.status(201).json({ message: "Sipariş başarıyla eklendi", orders: person.orders });

    } catch (error) {
        console.error(error); // Hata ayıklamak için hatayı konsola yazdır
        return res.status(500).json({ message: "Bir hata oluştu", error: error.message });
    }
};

// Adres Ekleme İşlemi
exports.postAdress = async (req, res) => {
    try {
        const user = res.locals.user;
        const person = await User.findById(user._id);

        const newAddress = new Adress({
            user:user._id,
            title: req.body.addressType,
            adress: req.body.address
        });

        const savedAddress = await newAddress.save();
        person.addresses.push(savedAddress._id);
        person.save();

        res.status(201).json({ message: "Adres başarıyla eklendi.", address: savedAddress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Adres eklenirken bir hata oluştu.", error: err.message });
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
        res.status(500).json({ message: "Adresler alınırken bir hata oluştu.", error: err.message });
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

        res.status(200).json({ message: "Adres başarıyla silindi.", deletedAddress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası oluştu.", error: error.message });
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
            return res.status(400).json({ error: "error",message: "Bu e-posta zaten kullanılmakta." });
        }

        const hashPass = await bcrypt.hash(req.body.password, 10);


        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPass
        })

        res.status(201).redirect("/auth/login");

    } catch (error) {
        res.status(500).json({
            error: "error",
            message: "Server is failer :" + error,
        })
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
        const payload = { id: user._id, email: user.email,username:user.name,role:user.role }; // Eklemek istediğin diğer alanlar

        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

        res.cookie("authToken",token,{httpOnly:true});
        
        setTimeout(()=>{
            res.status(201).redirect("/");
        },3000)
    } catch (err) {
        return res.status(500).json({
            error: "error",
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."
        });
    }
};

exports.postLogout = async (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, secure: true });

    // Kullanıcıyı giriş sayfasına yönlendir
    res.redirect('/auth/login');
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
        res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu.", error: err.message });
    }
};
