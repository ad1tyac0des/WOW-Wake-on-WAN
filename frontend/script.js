// === CONFIG ===
const BASE_URL = "https://wow-ttpo.onrender.com";

// Include credentials for cookies
axios.defaults.withCredentials = true;

// Elements
const loginSection = document.getElementById("login-section");
const controlSection = document.getElementById("control-section");
const loginMsg = document.getElementById("login-msg");
const statusMsg = document.getElementById("status-msg");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const pulseTimeInput = document.getElementById("pulseTime");

// === Login ===
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            loginMsg.textContent = "Please enter both username and password.";
            return;
        }

        const res = await axios.post(`${BASE_URL}/api/login`, { username, password });
        loginMsg.textContent = res.data.message;
        loginMsg.className = "text-green-400 text-center text-sm mt-3";

        // Switch UI
        loginSection.classList.add("hidden");
        controlSection.classList.remove("hidden");
    } catch (err) {
        console.error(err);
        loginMsg.textContent = err.response?.data?.message || "Login failed!";
        loginMsg.className = "text-red-400 text-center text-sm mt-3";
    }
});

// === Send Power Signal ===
document.getElementById("powerBtn").addEventListener("click", async () => {
    try {
        const duration = pulseTimeInput.value; 
        const res = await axios.post(`${BASE_URL}/api/power`, { duration: duration });

        statusMsg.textContent = res.data.message;
        statusMsg.className = "text-green-400 mt-3 text-sm";
    } catch (err) {
        console.error(err);
        statusMsg.textContent = err.response?.data?.message || "Failed to send signal!";
        statusMsg.className = "text-red-400 mt-3 text-sm";
    }
});

// === Logout ===
document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await axios.post(`${BASE_URL}/api/logout`);
        controlSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        usernameInput.value = "";
        passwordInput.value = "";
        statusMsg.textContent = "";
        loginMsg.textContent = "Logged out successfully.";
        loginMsg.className = "text-green-400 text-center text-sm mt-3";
    } catch (err) {
        console.error(err);
    }
});