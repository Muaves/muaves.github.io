document.addEventListener("DOMContentLoaded", function () {
    const placeholder = document.getElementById("cookie-placeholder");

    console.log("Cookie consent script initialized. Fetching snippet...");

    fetch('https://muaves.com/cookies/cookie_snipet.html')
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
    const isClosed = sessionStorage.getItem("cookieClosed");

    if (!consent && !isClosed) {
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
        sessionStorage.setItem("cookieClosed", "true");
        popup.style.display = "none";
        console.log("User declined for this session. Will ask again on next visit.");
    };
}

   function activateGA() {
       if (window.gaActivated) return;
       window.gaActivated = true;
       const s = document.createElement('script');
       s.async = true;
       s.src = 'https://www.googletagmanager.com/gtag/js?id=G-3K03LYDK01';
       document.head.appendChild(s);
       gtag('js', new Date());
       gtag('config', 'G-3K03LYDK01');
   }

console.log("Hello from cookie.js! Script executed.");