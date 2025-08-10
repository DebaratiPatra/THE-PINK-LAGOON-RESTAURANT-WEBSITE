// 
// ===== MODAL HANDLING =====
function openModal() {
  document.getElementById("bookingModal").style.display = "block";
}

function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("bookingModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ===== POPUP MESSAGE FUNCTION =====
function showPopup(message, color = "#4CAF50") {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.backgroundColor = color;
  popup.style.color = "#fff";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "16px";
  popup.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

// ===== FETCH BOOKINGS ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".button_act");
  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlace = button.getAttribute("data-place");
      openModal();
    });
  });

  // ✅ Only call if bookingList exists (i.e. on orders.html)
  if (document.getElementById("bookingList")) {
    fetchBookings();
  }

  // ✅ Call badge update on all pages
  updateBookingBadge();

  // ✅ Update user status UI on page load
  updateUserStatusUI();

  // Add logout click event handler
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          showPopup("Logged out successfully");
          updateUserStatusUI();
          // Optional: redirect after logout
          // window.location.href = "/login.html";
        } else {
          showPopup("Logout failed", "#f44336");
        }
      } catch (err) {
        console.error("Logout error:", err);
        showPopup("Logout failed", "#f44336");
      }
    });
  }
});

// ===== TOGGLE HAMBURGER =====
function toggleHamburger() {
  const menu = document.querySelector(".hamburger-content");
  menu.classList.toggle("show");
}

// ===== REMOVE LOCALSTORAGE ORDER COUNT DISPLAY (OPTIONAL) =====
const bookingCount = document.querySelector("#bookingBadge");
if (bookingCount) {
  bookingCount.style.display = "none";
}

// ===== BOOKING SUBMIT =====
const button_modal = document.querySelector("#buttonModal");
let selectedPlace = "";

if (button_modal) {
  button_modal.onclick = async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !email || !date || !time || !selectedPlace) {
      showPopup("Please fill in all fields!", "#f44336");
      return;
    }

    const booking = { name, email, date, time, place: selectedPlace };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await res.json();
      console.log("Response from booking:", data);

      if (!res.ok) {
        // This will catch max booking limit and other errors
        showPopup(data.message || "Error submitting booking.", "#f44336");
      } else {
        // Successful booking
        showPopup(data.message || "✅ Thank you! Your booking is confirmed.");
        closeModal();

        if (document.getElementById("bookingList")) {
          fetchBookings(); // only on orders.html
        }
        updateBookingBadge();
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      showPopup("Error submitting booking.", "#f44336");
    }
  };
}

// ===== FETCH BOOKINGS FROM BACKEND =====
function fetchBookings() {
  const bookingList = document.getElementById("bookingList");
  if (!bookingList) {
    console.warn("Element with ID 'bookingList' not found in DOM.");
    return;
  }

  bookingList.innerHTML = "";

  fetch("http://localhost:5000/api/bookings")
    .then((res) => res.json())
    .then((bookings) => {
      if (bookings.length === 0) {
        bookingList.innerHTML = `<p style="font-size:20px;text-align:center;">No bookings yet. Book your first experience at <a href="Offer.html">Offers Zone</a>.</p>`;
        return;
      }

      bookings.forEach((booking) => {
        const bookingDiv = document.createElement("div");
        bookingDiv.style.border = "1px solid pink";
        bookingDiv.style.padding = "10px";
        bookingDiv.style.marginBottom = "10px";
        bookingDiv.style.borderRadius = "10px";
        bookingDiv.style.backgroundColor = "#fff0f5";
        bookingDiv.style.display = "flex";
        bookingDiv.style.justifyContent = "space-between";

        bookingDiv.innerHTML = `
          <div>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Place:</strong> ${booking.place}</p>
          </div>
          <div>
            <button class="bookingDivEditBtn" data-id="${booking._id}">Edit</button>
            <button class="bookingDivDeleteBtn" data-id="${booking._id}">Delete</button>
          </div>
        `;

        bookingList.appendChild(bookingDiv);
      });
    })
    .catch((err) => {
      console.error("Error fetching bookings:", err);
      bookingList.innerHTML = `<p style="text-align:center; color:red;">Failed to load bookings.</p>`;
    });
}

// ===== EVENT DELEGATION FOR EDIT / DELETE =====
document.addEventListener("click", async function (e) {
  // DELETE
  if (e.target.classList.contains("bookingDivDeleteBtn")) {
    const orderId = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${orderId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          showPopup("Booking deleted.", "#2196F3");
          fetchBookings();
          updateBookingBadge();
        } else {
          showPopup("Delete failed.", "#f44336");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showPopup("Delete failed due to server error.", "#f44336");
      }
    }
  }

  // EDIT
  if (e.target.classList.contains("bookingDivEditBtn")) {
    const orderId = e.target.getAttribute("data-id");
    const newName = prompt("Enter new name:");
    const newTime = prompt("Enter new time (HH:MM):");

    if (newName && newTime) {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, time: newTime }),
        });
        if (res.ok) {
          showPopup("Booking updated.", "#2196F3");
          fetchBookings();
        } else {
          showPopup("Edit failed.", "#f44336");
        }
      } catch (err) {
        console.error("Edit error:", err);
        showPopup("Edit failed due to server error.", "#f44336");
      }
    }
  }
});

// ===== UPDATE BOOKING BADGE =====
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
        badge.style.top = "2.5rem";
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
