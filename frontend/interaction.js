// GSAP Microinteractions
gsap.registerPlugin();

// Initial page load animation
gsap.from(".fade-in", {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out",
});

// Button hover animations
document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.02,
            ease: "power2.out",
        });
    });

    btn.addEventListener("mouseleave", function () {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: "power2.out",
        });
    });

    btn.addEventListener("click", function () {
        gsap.to(this, {
            duration: 0.1,
            scale: 0.98,
            ease: "power2.out",
        });
        gsap.to(this, {
            duration: 0.2,
            scale: 1.02,
            delay: 0.1,
            ease: "elastic.out(1, 0.5)",
        });
    });
});

// Input focus animations
document.querySelectorAll(".input-field").forEach((input) => {
    input.addEventListener("focus", function () {
        gsap.to(this, {
            duration: 0.3,
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
            ease: "power2.out",
        });
    });

    input.addEventListener("blur", function () {
        gsap.to(this, {
            duration: 0.3,
            boxShadow: "0 0 0px rgba(255, 255, 255, 0)",
            ease: "power2.out",
        });
    });
});

// Section transition animations
const loginSection = document.getElementById("login-section");
const controlSection = document.getElementById("control-section");

function showLoginSection() {
    gsap.to(loginSection, {
        duration: 0.4,
        opacity: 1,
        pointerEvents: "auto",
        ease: "power2.out",
    });
    gsap.to(controlSection, {
        duration: 0.4,
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.out",
    });
}

function showControlSection() {
    gsap.to(controlSection, {
        duration: 0.4,
        opacity: 1,
        pointerEvents: "auto",
        ease: "power2.out",
    });
    gsap.to(loginSection, {
        duration: 0.4,
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.out",
    });
}

// Status message animations
function animateStatusMessage(element, isSuccess) {
    gsap.fromTo(
        element,
        { opacity: 0, y: -10 },
        {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
        }
    );
}

// Override original functions to add animations
const originalLoginBtn = document.getElementById("loginBtn");
const originalPowerBtn = document.getElementById("powerBtn");
const originalLogoutBtn = document.getElementById("logoutBtn");

originalLoginBtn.addEventListener("click", function () {
    setTimeout(() => {
        if (!loginSection.classList.contains("hidden")) {
            showControlSection();
        }
    }, 300);
});

originalLogoutBtn.addEventListener("click", function () {
    setTimeout(() => {
        if (!controlSection.classList.contains("hidden")) {
            showLoginSection();
        }
    }, 300);
});

// Animate status messages
const statusMsg = document.getElementById("status-msg");
const loginMsg = document.getElementById("login-msg");

const observer = new MutationObserver(() => {
    if (statusMsg.textContent) animateStatusMessage(statusMsg);
    if (loginMsg.textContent) animateStatusMessage(loginMsg);
});

observer.observe(statusMsg, {
    childList: true,
    characterData: true,
    subtree: true,
});
observer.observe(loginMsg, {
    childList: true,
    characterData: true,
    subtree: true,
});

// Status dot pulse
gsap.to(".status-dot", {
    duration: 2,
    repeat: -1,
    opacity: 0.5,
    ease: "sine.inOut",
});
