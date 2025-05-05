const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const copyIcon = document.querySelector(".input-box span");

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "^!$%&|[](){}:;.,*+-#@<>~",
};

const generatePassword = () => {
    let staticPassword = "",
        randomPassword = "",
        excludeDuplicate = false,
        passLength = lengthSlider.value;

    options.forEach(option => {
        if (option.checked) {
            if (option.id !== "exc-duplicate" && option.id !== "spaces") {
                staticPassword += characters[option.id];
            } else if (option.id === "spaces") {
                staticPassword += `  ${staticPassword}  `;
            } else {
                excludeDuplicate = true;
            }
        }
    });

    if (staticPassword.length === 0) {
        alert("Please select at least one character type.");
        return;
    }

    if (excludeDuplicate && passLength > staticPassword.length) {
        alert("Password length exceeds unique characters available.");
        return;
    }

    // Slot machine effect
    let slotRolls = 4; // Number of rolls
    let intervalSpeed = 100; // Speed of roll (in ms)
    let finalPassword = ""; // The final generated password

    const rollSlot = () => {
        let tempPassword = "";
        for (let i = 0; i < passLength; i++) {
            let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
            tempPassword += randomChar;
        }
        passwordInput.value = tempPassword;
    };

    let interval = setInterval(() => {
        rollSlot();
        slotRolls--;
        if (slotRolls === 0) {
            clearInterval(interval); // Stop rolling when slotRolls reaches 0
            // Now generate the final password
            for (let i = 0; i < passLength; i++) {
                let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
                if (excludeDuplicate) {
                    if (!randomPassword.includes(randomChar) || randomChar == " ") {
                        randomPassword += randomChar;
                    } else {
                        i--;
                    }
                } else {
                    randomPassword += randomChar;
                }
            }
            animatePasswordDisplay(randomPassword);
            updatePassIndicator(randomPassword);
        }
    }, intervalSpeed);
};

function animatePasswordDisplay(randomPassword) {
    const input = passwordInput;

    input.value = ""; // Clear existing content
    let i = 0;

    const interval = setInterval(() => {
        input.value += randomPassword.charAt(i);
        i++;
        if (i >= randomPassword.length) clearInterval(interval);
    }, 50); // Adjust speed here (lower = faster)
}

function estimateCrackTime(randomPassword) {
    let charsetSize = 0;
    if (/[a-z]/.test(randomPassword)) charsetSize += 26;
    if (/[A-Z]/.test(randomPassword)) charsetSize += 26;
    if (/[0-9]/.test(randomPassword)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(randomPassword)) charsetSize += 33;
    if (charsetSize === 0) charsetSize = 26;

    const guessesPerSecond = 1e10;
    const combinations = Math.pow(charsetSize, randomPassword.length);
    const seconds = combinations / guessesPerSecond;

    if (seconds < 1) return "instantly";
    else if (seconds < 60) return `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    else if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;

    const years = Math.round(seconds / 31536000);
    if (years < 1e6) return `${years} years`;
    if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
    if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
    if (years < 1e15) return `${Math.round(years / 1e12)} trillion years`;
    return "ETERNITY";
}


const updatePassIndicator = (password = passwordInput.value) => {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;
    if (charsetSize === 0) charsetSize = 26;

    const guessesPerSecond = 1e10;
    const combinations = Math.pow(charsetSize, password.length);
    const seconds = combinations / guessesPerSecond;

    passIndicator.id =
        seconds <= 600
            ? "veryweak"
            : seconds <= 36000
                ? "weak"
                : seconds <= 864000
                    ? "moderate"
                    : "strong";

    document.getElementById("crackTime").innerText = `Estimated Crack Time: ${estimateCrackTime(password)}`;
};


const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
};

updateSlider();

const copyPassword = () => {
    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = "check";
    copyIcon.style.color = "#4285F4";
    setTimeout(() => {
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1500);
};

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
