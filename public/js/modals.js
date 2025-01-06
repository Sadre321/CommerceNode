const addAddressModal = document.getElementById("addAddressModal");
const modalContent = addAddressModal.querySelector(".modal");

function openModal() {
  addAddressModal.classList.remove("hidden");
  setTimeout(() => {
    modalContent.classList.add("show");
  }, 10);
}

const closeModal = () => {
  modalContent.classList.remove("show");
  setTimeout(() => {
    addAddressModal.classList.add("hidden");
  }, 300);
};

document.getElementById("closeModal").addEventListener("click", (event) => {
  event.preventDefault(); // Varsayılan davranışı engelle
  closeModal();
});
