const { User } = require("../model/authModel");
const jwt = require("jsonwebtoken");
const { Category } = require("../model/categoryModel");
const { Product } = require("../model/productModel");

require("dotenv").config();

const getUserFromToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return reject(err);
      }
      resolve(user);
    });
  });
};

const renderHomePage = (res, user, categories, products) => {
  res.render("home", { page_name: "Home", user, categories, products });
};

const renderProductDetailsPage = (res, user, product) => {
  res.render("productDetails", { page_name: "Details", user, product });
};

exports.getLoginPage = (req, res) => {
  res.render("login", { page_name: "Login" });
};

exports.getHomePage = async (req, res) => {
  const token = req.cookies.authToken;
  const secretKey = process.env.SECRET_KEY;

  const categorySlug = req.query.category;
  const filter = {};

  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }
    filter.category = category._id;
  }

  const categories = await Category.find();
  const products = await Product.find(filter).sort("-createdAt");

  if (token) {
    try {
      const userFromToken = await getUserFromToken(token, secretKey);
      req.user = userFromToken;

      const foundUser = await User.findById(req.user.id);
      if (!foundUser) {
        return res
          .status(404)
          .json({ error: "error", message: "Kullanıcı bulunamadı" });
      }

      return renderHomePage(res, foundUser, categories, products);
    } catch (err) {
      return res
        .status(403)
        .json({ error: "error", message: "Yetkisiz erişim" });
    }
  } else {
    renderHomePage(res, null, categories, products);
  }
};

exports.getProductDetailsPage = async (req, res) => {
  const token = req.cookies.authToken;
  const secretKey = process.env.SECRET_KEY;
  const productSlug = req.params.slug;

  const product = await Product.findOne({ slug: productSlug });

  if (token) {
    try {
      const userFromToken = await getUserFromToken(token, secretKey);
      req.user = userFromToken;

      const foundUser = await User.findById(req.user.id);
      if (!foundUser) {
        return res
          .status(404)
          .json({ error: "error", message: "Kullanıcı bulunamadı" });
      }

      return renderProductDetailsPage(res, foundUser, product);
    } catch (err) {
      return res
        .status(403)
        .json({ error: "error", message: "Yetkisiz erişim" });
    }
  } else {
    renderProductDetailsPage(res, null, product);
  }
};

exports.getRegisterPage = (req, res) => {
  res.render("register", { page_name: "Register" });
};

exports.getUsersPage = async (req, res) => {
  try {
    const users = await User.find();

    res.render("users", { page_name: "Users", users });
  } catch (error) {
    console.log(error);
  }
};

exports.getCategoriesPage = async (req, res) => {
  const categories = await Category.find();

  res.render("categories", { page_name: "Categories", categories });
};

exports.getOrdersPage = (req, res) => {
  res.render("orders", { page_name: "Orders" });
};

exports.getUserSettingsPage = async (req, res) => {
  const user = res.locals.user;

  const { favorites, addresses } = await User.findById(user._id)
    .populate("favorites")
    .populate("addresses");

  res.render("settings", { page_name: "Settings", user, addresses, favorites });
};

exports.getUserMarketPage = async (req, res) => {
  const user = res.locals.user;
  try {
    const orders = await User.findById(user._id).populate({
      path: "orders",
      populate: {
        path: "product", // Burada product'ı populate ediyoruz
      },
    });

    // Toplam fiyatı hesaplayalım
    let totalPrice = 0;

    if (orders && orders.orders) {
      orders.orders.forEach((order) => {
        // Eğer ürün fiyatı varsa toplam fiyata ekleyelim
        if (order.product && order.product.price) {
          totalPrice += order.product.price * order.quantity;
        }
      });
    } else {
      console.log("Sipariş bulunamadı");
    }

    if (!orders) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // Toplam fiyatı frontend'e gönder
    res.render("market", { page_name: "Market", user, orders, totalPrice,stripeKey:process.env.STRIPE_PUBLIC_KEY  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};

exports.successPage = async (req, res) => {
  const user = res.locals.user;
  try {
    res.render("successPage", { page_name: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu", error: error.message });
  }
};
