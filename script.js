const pwElement = document.getElementById('pw');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');
const lengthInput = document.getElementById('len');
const upperInput = document.getElementById('upper');
const lowerInput = document.getElementById('lower');
const numberInput = document.getElementById('number');
const symbolInput = document.getElementById('symbol');

generateButton.addEventListener('click', generatePassword);

function generatePassword() {
  const length = lengthInput.value;
  const hasUpper = upperInput.checked;
  const hasLower = lowerInput.checked;
  const hasNumber = numberInput.checked;
  const hasSymbol = symbolInput.checked;

  let password = '';
  const characters = '';

  if (hasUpper) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (hasLower) characters += 'abcdefghijklmnopqrstuvwxyz';
  if (hasNumber) characters += '0123456789';
  if (hasSymbol) characters += '!@#$%^&*()_+-={}:<>?';

  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  pwElement.textContent = password;
}

copyButton.addEventListener('click', copyPassword);

function copyPassword() {
  const password = pwElement.textContent;
  navigator.clipboard.writeText(password);
  alert('Password copied to clipboard!');
}
