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
            passwordInput.value = randomPassword;
            updatePassIndicator();
        }
    }, intervalSpeed);
};

const updatePassIndicator = () => {
    passIndicator.id =
        lengthSlider.value <= 8
            ? "weak"
            : lengthSlider.value <= 16
                ? "medium"
                : "strong";
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
