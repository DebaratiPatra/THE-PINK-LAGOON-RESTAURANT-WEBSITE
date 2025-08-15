document.addEventListener("DOMContentLoaded", function () {
    // --- NAVBAR ACTIVE LINK ---
    const navLinks = document.querySelectorAll(".nav_element li a");

    function removeActiveClass() {
        navLinks.forEach(link => link.classList.remove("active"));
    }

    // Check localStorage for active tab
    const activeTab = localStorage.getItem("activeTab");
    if (activeTab) {
        removeActiveClass();
        const activeLink = document.querySelector(`.nav_element li a[href='${activeTab}']`);
        if (activeLink) activeLink.classList.add("active");
    } else {
        // Default to first link
        if (navLinks.length > 0) navLinks[0].classList.add("active");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            removeActiveClass();
            this.classList.add("active");
            localStorage.setItem("activeTab", this.getAttribute("href"));
        });
    });

    // --- SLIDESHOW FUNCTIONALITY ---
    const slides = document.querySelectorAll(".mySlides");
    const dots = document.querySelectorAll(".dot");

    if (slides.length > 0) {
        let slideIndex = 0;

        function showSlides(n) {
            slides.forEach(slide => slide.classList.remove("active"));
            if (dots.length > 0) dots.forEach(dot => dot.classList.remove("active"));

            slideIndex = (n + slides.length) % slides.length; // wrap around
            slides[slideIndex].classList.add("active");
            if (dots.length > 0) dots[slideIndex].classList.add("active");
        }

        function plusSlides(n) {
            showSlides(slideIndex + n);
        }

        function currentSlide(n) {
            showSlides(n - 1);
        }

        const prevButton = document.querySelector(".prev");
        const nextButton = document.querySelector(".next");

        if (prevButton) prevButton.addEventListener("click", () => plusSlides(-1));
        if (nextButton) nextButton.addEventListener("click", () => plusSlides(1));

        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener("click", () => currentSlide(index + 1));
            });
        }

        // Initialize
        showSlides(0);
    }

    // --- USER LOGIN DISPLAY ---
    const userContainer = document.getElementById("userContainer");
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser")); // adjust key if needed

    if (userContainer) {
        if (storedUser && storedUser.name) {
            // User is logged in
            userContainer.innerHTML = `
                <div class="user-info">
                    <img src="images/profile_icon.png" alt="profile" class="profile-icon">
                    <span>${storedUser.name}</span>
                    <button id="logoutBtn">Logout</button>
                </div>
            `;
            const logoutBtn = document.getElementById("logoutBtn");
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                location.reload();
            });
        } else {
            // Not logged in
            userContainer.innerHTML = `<a href="login.html" id="loginLink" style="text-decoration:none; font-weight:400; color:#ed68aa;">Login/Join</a>`;
        }
    }
});
