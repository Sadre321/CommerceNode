const {
  User,
  Orders,
} = require("../model/authModel");

const stripe = require("stripe")(process.env.STRIPE_BACKEND_KEY);

require("dotenv").config();

exports.payment = async (req, res) => {
  const user = res.locals.user;
  try {
    const orders = await User.findById(user._id).populate({
      path: "orders",
      populate: {
        path: "product", // Burada product'ı populate ediyoruz
      },
    });

    // Ürünlerinizi 'line_items' formatında Stripe için hazırlama
    const lineItems = orders.orders.map((order) => ({
      price_data: {
        currency: "usd", // Para birimi
        product_data: {
          name: order.product.name, // Ürün adı
        },
        unit_amount: Math.round(order.product.price * 100), // Ürün fiyatını cent cinsine çevirme
      },
      quantity: order.quantity, // Ürün adedi
    }));

    // Stripe ödeme oturumu oluşturma
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"], // Kullanılabilir ödeme yöntemleri
      line_items: lineItems, // Satın alınan ürünler
      mode: "payment", // Ödeme modu (tek seferlik ödeme)
      success_url: `http://localhost:3000/success`, // Başarı durumunda yönlendirme
      cancel_url: `http://localhost:3000/cancel`, // İptal durumunda yönlendirme
    });

    // Başarıyla ödeme yapıldıktan sonra siparişleri temizleme
    await User.findByIdAndUpdate(user._id, {
      $set: { orders: [] } // Siparişleri boşaltıyoruz
    });

    // Stripe oturum ID'sini döndürme
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

exports.paymentList = async (req, res) => {
    try{
      const paymentIntents = await stripe.paymentIntents.list();
      res.status(200).json(paymentIntents)
    }catch(error){
      console.error("Stripe API hatası:", error);
      res.status(500).send("Bir hata oluştu.");
    }
};


exports.removeCart = async (req, res) => {
  try {
    const orderId = req.params.id; // Silinecek siparişin ID'si

    const user = res.locals.user; // Kullanıcının bilgileri
    const person = await User.findById(user._id).populate("orders"); // Kullanıcıyı siparişleri ile birlikte al

    if (!person) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı", error: 401 });
    }

    person.orders.pull(orderId);

    // Siparişi veritabanından kaldır
    await Orders.findByIdAndDelete(orderId);

    // Kullanıcıyı güncelle
    await person.save();

    return res
      .status(200)
      .json({ message: "Sipariş başarıyla silindi", orders: person.orders });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Bir hata oluştu", error: error.message });
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

    res.status(200).json({
      message: "Ürün favorilere eklendi",
      favorites: person.favorites,
    });
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

    res.status(200).json({
      message: "Ürün favorilere kaldırıldı",
      favorites: person.favorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};

exports.postCart = async (req, res) => {
  try {
    const { id, color, size, quantity } = req.body; // 'id' çıkarıldı

    const user = res.locals.user; // Kullanıcının bilgileri
    const person = await User.findById(user._id);

    if (!person) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı", error: 401 });
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

    return res
      .status(201)
      .json({ message: "Sipariş başarıyla eklendi", orders: person.orders });
  } catch (error) {
    console.error(error); // Hata ayıklamak için hatayı konsola yazdır
    return res
      .status(500)
      .json({ message: "Bir hata oluştu", error: error.message });
  }
};
