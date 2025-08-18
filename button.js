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

// ===== UPDATE NAVBAR USER STATUS =====
function updateUserStatusUI() {
  const userContainer = document.getElementById("userContainer");
  if (!userContainer) return;

  const loggedInEmail = localStorage.getItem("loggedInUserEmail");
  const loggedInUsername = localStorage.getItem("loggedInUsername");

  if (loggedInEmail) {
    userContainer.innerHTML = `
    <span style="display:flex; align-items:center; gap:8px;">
      <img src="images/profile-user.png" alt="profile" style="width:28px; height:28px; border-radius:50%;">
      <span style="color:#000000; font-weight:300; margin-right:5rem; font-size:20px">
        ${loggedInUsername || loggedInEmail}
      </span>
      <button id="logoutBtn" style="
        padding:5px 12px; 
        background:#ed68aa; 
        color:white; 
        border:none; 
        border-radius:6px; 
        cursor:pointer;
        font-weight:500;
      ">
        Logout
      </button>
    </span>
    `;

    document.getElementById("logoutBtn").addEventListener("click", function() {
      localStorage.removeItem("loggedInUserEmail");
      localStorage.removeItem("loggedInUsername");
      localStorage.removeItem("authToken");
      window.location.reload();
    });
  } else {
    userContainer.innerHTML = `
    <a href="login.html" id="loginLink" style="text-decoration:none; font-weight:400; color:#ed68aa;">
      Login /
    </a>
    <a href="register.html" id="registerLink" style="text-decoration:none; font-weight:400; color:#ed68aa;">
      Join
    </a>
  `;
  }
}

// ===== TOGGLE HAMBURGER =====
function toggleHamburger() {
  const menu = document.querySelector(".hamburger-content");
  menu.classList.toggle("show");
}

// ===== BOOKING BUTTONS CONTROL BASED ON LOGIN =====
function initBookButtons() {
  const bookButtons = document.querySelectorAll(".button_act");
  const loggedInEmail = localStorage.getItem("loggedInUserEmail");

  bookButtons.forEach((button) => {
    // Remove previous click listeners to avoid duplicates
    button.replaceWith(button.cloneNode(true));
  });

  const updatedButtons = document.querySelectorAll(".button_act");

  updatedButtons.forEach((button) => {
    if (!loggedInEmail) {
      button.disabled = true;
      button.style.cursor = "not-allowed";
      button.title = "Please login/register to book";
      button.addEventListener("click", (e) => {
        e.preventDefault();
        showPopup("⚠ Please login/register to book!", "#f44336");
      });
    } else {
      button.disabled = false;
      button.style.cursor = "pointer";
      button.addEventListener("click", () => {
        selectedPlace = button.getAttribute("data-place");
        openModal();
      });
    }
  });
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

      if (!res.ok) {
        showPopup(data.message || "Error submitting booking.", "#f44336");
      } else {
        showPopup(data.message || "✅ Thank you! Your booking is confirmed.");
        closeModal();
        if (document.getElementById("bookingList")) fetchBookings();
        updateBookingBadge();
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      showPopup("Error submitting booking.", "#f44336");
    }
  };
}

// ===== FETCH BOOKINGS =====
function fetchBookings() {
  const bookingList = document.getElementById("bookingList");
  if (!bookingList) return;

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

// ===== EDIT / DELETE BOOKINGS =====
document.addEventListener("click", async function (e) {
  const orderId = e.target.getAttribute("data-id");

  if (e.target.classList.contains("bookingDivDeleteBtn")) {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${orderId}`, { method: "DELETE" });
        if (res.ok) {
          showPopup("Booking deleted.", "#2196F3");
          fetchBookings();
          updateBookingBadge();
        } else showPopup("Delete failed.", "#f44336");
      } catch (err) {
        console.error("Delete error:", err);
        showPopup("Delete failed due to server error.", "#f44336");
      }
    }
  }

  if (e.target.classList.contains("bookingDivEditBtn")) {
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
        } else showPopup("Edit failed.", "#f44336");
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
      } else badge.style.display = "none";
    })
    .catch((err) => console.error("Error fetching bookings for badge:", err));
}

// ===== INIT ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  updateUserStatusUI();
  initBookButtons();

  // Fetch bookings if orders.html
  if (document.getElementById("bookingList")) fetchBookings();
  updateBookingBadge();
});
