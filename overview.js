// ===== TOGGLE HAMBURGER =====
function toggleHamburger() {
  const menu = document.querySelector(".hamburger-content");
  menu.classList.toggle("show");
}

function updateBookingBadge() {
  fetch("http://localhost:5000/api/bookings")
    .then((res) => res.json())
    .then((bookings) => {
      const badge = document.getElementById("bookingBadge");
      if (!badge) return;

      if (bookings.length > 0) {
        badge.textContent = bookings.length;
        badge.style.display = "inline-block";
        badge.style.position = "absolute";
        badge.style.top = "2.5rem";       // lift it up
        badge.style.right = "2.2rem";   
        badge.style.backgroundColor = "#fc3737ff";
        badge.style.color = "white";
        badge.style.borderRadius = "50%";
        badge.style.padding = "2px 6px";
        badge.style.marginLeft = "8px";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "bold";
      } else {
        badge.style.display = "none";
      }
    })
    .catch((err) => {
      console.error("Error fetching bookings for badge:", err);
    });
}

// Call once on page load
document.addEventListener("DOMContentLoaded", updateBookingBadge);