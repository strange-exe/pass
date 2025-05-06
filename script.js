let currentPassword = "";

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

    for (let i = 0; i < passLength; i++) {
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        if (excludeDuplicate) {
            if (!randomPassword.includes(randomChar) || randomChar === " ") {
                randomPassword += randomChar;
            } else {
                i--; 
            }
        } else {
            randomPassword += randomChar;
        }
    }

    currentPassword = randomPassword;
    passwordInput.value = currentPassword;
    animatePasswordDisplay(currentPassword);
    updatePassIndicator(currentPassword);
};

function animatePasswordDisplay(randomPassword) {
    const input = passwordInput;

    input.placeholder="           Generating....."

    input.value = ""; 
    let i = 0;

    const interval = setInterval(() => {
        input.value += randomPassword.charAt(i);
        i++;
        if (i >= randomPassword.length) clearInterval(interval);
    }, 50); // Adjust speed here (lower = faster)
}

const updatePassIndicator = (password = currentPassword) => {
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
    const value = lengthSlider.value;
    const min = lengthSlider.min;
    const max = lengthSlider.max;

    const percent = ((value - min) / (max - min)) * 100;

    lengthSlider.style.backgroundSize = `${percent}% 100%`;

    document.querySelector(".pass-length span").innerText = value;
    
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
lengthSlider.addEventListener("input", () => {
    updateSlider();
    generatePassword();
    updatePassIndicator(currentPassword);
});
generateBtn.addEventListener("click", generatePassword);
