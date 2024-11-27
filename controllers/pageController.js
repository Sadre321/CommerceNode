const { User } = require("../model/authModel");
const jwt = require("jsonwebtoken");
const { Category } = require("../model/categoryModel");
const { Product } = require("../model/productModel");

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

exports.getHomePage = async (req, res) => {
    const token = req.cookies.authToken;
    const secretKey = process.env.SECRET_KEY;

    const categorySlug = req.query.category;
        const filter = {};

        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (!category) {
                return res.status(404).json({ status: 'error', message: 'Category not found' });
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
                return res.status(404).json({ error: "error", message: "Kullanıcı bulunamadı" });
            }

            return renderHomePage(res, foundUser, categories, products);
        } catch (err) {
            return res.status(403).json({ error: "error", message: "Yetkisiz erişim" });
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
                return res.status(404).json({ error: "error", message: "Kullanıcı bulunamadı" });
            }

            return renderProductDetailsPage(res, foundUser, product);
        } catch (err) {
            return res.status(403).json({ error: "error", message: "Yetkisiz erişim" });
        }
    } else {
        renderProductDetailsPage(res, null, product);
    }
};
