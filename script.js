document.addEventListener("DOMContentLoaded", function () {
    // Select all navigation links
    let navLinks = document.querySelectorAll(".nav_element li a");

    // Function to remove active class from all links
    function removeActiveClass() {
        navLinks.forEach(link => link.classList.remove("active"));
    }

    // Check localStorage for active tab
    let activeTab = localStorage.getItem("activeTab");

    if (activeTab) {
        removeActiveClass();
        let activeLink = document.querySelector(`.nav_element li a[href='${activeTab}']`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    } else {
        // Default to "Overview" if no tab is stored
        let overviewLink = document.querySelector(".nav_element li:first-child a");
        if (overviewLink) {
            overviewLink.classList.add("active");
        }
    }

    // Add click event to all nav links
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            removeActiveClass(); // Remove active from all
            this.classList.add("active"); // Add active to clicked link

            // Store active tab in localStorage
            localStorage.setItem("activeTab", this.getAttribute("href"));
        });
    });

    // --- SLIDESHOW FUNCTIONALITY ---
    let slideIndex = 0;
    let slides = document.querySelectorAll(".mySlides");
    let dots = document.querySelectorAll(".dot");

    function showSlides(n) {
        slides.forEach(slide => slide.classList.remove("active"));
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove("active"));
        }

        slideIndex = (n + slides.length) % slides.length;
        slides[slideIndex].classList.add("active");
        if (dots.length > 0) {
            dots[slideIndex].classList.add("active");
        }
    }

    function plusSlides(n) {
        showSlides(slideIndex + n);
    }

    function currentSlide(n) {
        showSlides(n - 1);
    }

    let prevButton = document.querySelector(".prev");
    let nextButton = document.querySelector(".next");

    if (prevButton && nextButton) {
        prevButton.addEventListener("click", () => plusSlides(-1));
        nextButton.addEventListener("click", () => plusSlides(1));
    }

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => currentSlide(index + 1));
        });
    }

    // Initialize the slideshow
    showSlides(0);
});