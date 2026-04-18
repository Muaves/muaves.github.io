document.addEventListener("DOMContentLoaded", function () {
    const placeholder = document.getElementById("cookie-placeholder");

    console.log("Cookie consent script initialized. Fetching snippet...");

    fetch('https://muaves.com/cookies/redstone-launcher/cookie_snipet_rl.html')
        .then(response => {
            if (!response.ok) throw new Error('Could not find the cookie snippet file');
            return response.text();
        })
        .then(data => {
            placeholder.innerHTML = data;
            initCookieLogic();
            console.log("Cookie snippet loaded and logic initialized.");
        })
        .catch(error => {
            console.error("Error loading the cookie popup:", error);
        });
});

function initCookieLogic() {
    const popup = document.getElementById("cookie-popup");
    const acceptBtn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies");

    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
        popup.style.display = "block";
    } else if (consent === "accepted") {
        activateGA();
        console.log("User previously accepted. GA is active.");
    }

    acceptBtn.onclick = () => {
        localStorage.setItem("cookieConsent", "accepted");
        popup.style.display = "none";
        activateGA();
        console.log("User just accepted. GA is now active.");
    };

    declineBtn.onclick = () => {
        localStorage.setItem("cookieConsent", "declined");
        popup.style.display = "none";
        console.log("User declined. GA will stay off.");
    };
}

function activateGA() {
    console.log("GA4 Active: G-3K03LYDK01");
    if (typeof gtag === 'function') {
        gtag('config', 'G-3K03LYDK01');
    } else {
        console.warn("gtag is not defined. Make sure the Google script is in your <head>!");
    }
}

console.log("Hello from cookie.js! Script executed.");
