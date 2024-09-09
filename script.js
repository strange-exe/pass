// script.js
const PwEl = document.getElementById("pw");
const copyEl = document.getElementById("copy");
const lenEl = document.getElementById("len");
const upperEl = document.getElementById("upper");
const lowerEl = document.getElementById("lower");
const symbolEl = document.getElementById("symbol");
const generateEl = document.getElementById("generate");
const numberEl = document.getElementById("number");

const characterSets = [
  { chars: "abcdefghijklmnopqrstuvwxyz", enabled: lowerEl.checked },
  { chars: "ABCDEFGHIJKLMNOPQSRTUVWXYZ", enabled: upperEl.checked },
  { chars: "0123456789", enabled: numberEl.checked },
  { chars: "!@#$%&*", enabled: symbolEl.checked },
];

function generatePassword() {
  const len = lenEl.value;
  let password = "";
  for (let i = 0; i < len; i++) {
    const charSet = characterSets.find(set => set.enabled);
    if (!charSet) break;
    password += charSet.chars[Math.floor(Math.random() * charSet.chars.length)];
  }
  PwEl.innerText = password;
  PwEl.style.opacity = 1; // Make the password visible
}

generateEl.addEventListener("click", generatePassword);

copyEl.addEventListener("click", async () => {
  const password = PwEl.innerText;
  if (!password) return;
  await navigator.clipboard.writeText(password);
  alert("Password copied to clipboard!");
});
