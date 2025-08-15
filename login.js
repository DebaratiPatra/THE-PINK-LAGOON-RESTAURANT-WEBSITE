document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check if already logged in
    if (localStorage.getItem("loggedInUserEmail") === email) {
        document.getElementById("loginError").textContent = "⚠ User already logged in!";
        document.getElementById("loginError").style.display = "block";
        document.getElementById("loginSuccess").style.display = "none";
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            // Save token and email in localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("loggedInUserEmail", email);

            const username = data.username || email.split("@")[0];
            localStorage.setItem("loggedInUsername", username);

            // Show success
            document.getElementById("loginSuccess").style.display = "block";
            document.getElementById("loginError").style.display = "none";

            // Redirect after delay
            setTimeout(() => {
                window.location.href = "Overview.html";
            }, 1500);
        } else {
            // Show error
            document.getElementById("loginError").textContent = data.message || "Invalid email or password.";
            document.getElementById("loginError").style.display = "block";
            document.getElementById("loginSuccess").style.display = "none";
        }
    } catch (err) {
        console.error("Login error:", err);
        document.getElementById("loginError").textContent = "Server error. Please try again.";
        document.getElementById("loginError").style.display = "block";
        document.getElementById("loginSuccess").style.display = "none";
    }
});
