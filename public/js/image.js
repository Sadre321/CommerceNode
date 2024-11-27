const sectionImg = document.querySelectorAll('#sectionImg');
const imgArea = document.getElementById("imgArea");

imgArea.addEventListener('mousemove', (e) => {

    const { left, top, width, height } = imgArea.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Zoom efektini uygulamak için
    const zoomFactor = 2; // Yakınlaştırma oranı
    imgArea.style.transformOrigin = `${(x / width) * 100}% ${(y / height) * 100}%`;

    imgArea.style.transform = `scale(${zoomFactor})`;
});

imgArea.addEventListener('mouseleave', () => {
    imgArea.style.transform = 'scale(1)'; // Normal boyuta döndür
});

sectionImg.forEach(img => {
    img.addEventListener('click', (e) => {
        imgArea.src = img.currentSrc;
    });
});