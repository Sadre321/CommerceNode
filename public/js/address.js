document
        .getElementById("adressForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const data = {
            address: document.getElementById("address").value,
            addressType: document.getElementById("addressType").value,
          };

          console.log(data);

          try {
            const response = await fetch("http://localhost:3000/auth/adress", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              const result = await response.json();
              await updatedAdresses();
              closeModal(); // Modalı kapat
            } else {
              console.error("Adres eklenirken bir hata oluştu.");
            }
          } catch (error) {
            console.error("Hata:", error);
          }
        });

      document.querySelectorAll("#deleteAdress").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async (e) => {
          const deleteAdress = e.target.dataset.id;
          try {
            const response = await fetch(`http://localhost:3000/auth/adress/${deleteAdress}`, {
              method: "DELETE",
            });

            if(response.ok){
              console.log("Silme Basarili");
              await updatedAdresses();
            }else{
              console.log("Bir hata yasandi");
            }

          } catch (err) {
            console.log("Server Hatasi Yasandi");
          }
        });
      });

      const updatedAdresses = async () => {
        const response = await fetch("http://localhost:3000/auth/adress",{method:"GET"});
        if (response.ok) {
          const addresses = await response.json();
          const addressContainer = document.querySelector(".address-container"); // Adreslerin bulunduğu div
          addressContainer.innerHTML = ""; // Eski adresleri temizle
          addresses.forEach((adress) => {
            const adressElement = `
                  <div class="p-2 bg-white border shadow text-[#f84525] border-[#f84525] rounded-lg w-48 h-32 relative">
                      <p>${adress.adress}</p>
                      <h1 class="font-medium text-sm text-gray-700">${adress.title}</h1>
                      <div class="absolute -top-2 -left-2 cursor-pointer p-1 border rounded-full flex justify-center items-center border-[#f84525] bg-white w-6 h-6" id="deleteAdress" 
                        data-id="${adress._id}"
                      >x</div>
                  </div>`;
            addressContainer.innerHTML += adressElement; // Yeni adresleri ekle
          });
        }
      };
    