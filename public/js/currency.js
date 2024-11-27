 // Fiyatı biçimlendirme fonksiyonu
 const formatCurrency = (amount, currency = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Ürün fiyatını ayarla
const productPrice =  document.getElementById("productPrice").dataset.price;
document.getElementById("productPrice").innerText = formatCurrency(productPrice, 'TRY');