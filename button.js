// Open Modal
function openModal() {
  document.getElementById("bookingModal").style.display = "block";
}

// Close Modal
function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
}

// Optional: Close when clicking outside modal
window.onclick = function(event) {
  const modal = document.getElementById("bookingModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// Attach to all .button_act buttons
document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".button_act");
  bookButtons.forEach(button => {
    button.addEventListener("click", openModal);
  });
});
