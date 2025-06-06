// Caesar Cipher
function caesarCipher(text, key) {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z
      return String.fromCharCode(((code - 65 + key + 26) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      return String.fromCharCode(((code - 97 + key + 26) % 26) + 97);
    } else {
      return char; // Non-alphabet characters
    }
  }).join('');
}

function bruteForceCaesar() {
  let text = document.getElementById("shiftInput").value;
  let output = "";

  for (let key = 1; key <= 25; key++) {
    let result = caesarCipher(text, -key);
    output += `Shift ${key}: ${result}\n`;
  }

  document.getElementById("caesarResult").textContent = output;
}

function clearCaesar() {
  document.getElementById("shiftInput").value = "";
  document.getElementById("shiftKey").value = "";
  document.getElementById("caesarResult").textContent = "";
}
// Caesar cipher core logic (supports both encryption & decryption)
function caesarCipher(text, key) {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // A-Z
      return String.fromCharCode(((code - 65 + key + 26) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      // a-z
      return String.fromCharCode(((code - 97 + key + 26) % 26) + 97);
    } else {
      return char; // keep non-alphabet characters
    }
  }).join('');
}

function encryptCaesar() {
  let text = document.getElementById("shiftInput").value;
  let key = parseInt(document.getElementById("shiftKey").value);
  let result = caesarCipher(text, key);
  document.getElementById("caesarResult").textContent = result;
}

function decryptCaesar() {
  let text = document.getElementById("shiftInput").value;
  let key = parseInt(document.getElementById("shiftKey").value);
  let result = caesarCipher(text, -key);
  document.getElementById("caesarResult").textContent = result;
}

// RSA (very simplified version using small primes)
let rsa = {
  p: 3,
  q: 11,
  e: 3,
  d: 7,
  n: 33
};

function generateRSAKeys() {
  document.getElementById("rsaPublicKey").textContent = `(${rsa.e}, ${rsa.n})`;
  document.getElementById("rsaPrivateKey").textContent = `(${rsa.d}, ${rsa.n})`;
}

function encryptRSA() {
  let text = document.getElementById("rsaInput").value;
  let encrypted = text.split('').map(char => 
    Math.pow(char.charCodeAt(0), rsa.e) % rsa.n
  ).join(' ');
  document.getElementById("rsaResult").textContent = encrypted;
}

function decryptRSA() {
  const input = document.getElementById('rsaInput').value.trim();
  const encryptedNumbers = input.split(" ").map(Number);
  const resultArea = document.getElementById("rsaResult");

  const d = 7n;  // Replace with actual private exponent
  const n = 33n; // Replace with actual n

  const decryptedChars = encryptedNumbers.map(num => {
    let decrypted = BigInt(num) ** d % n;
    let code = Number(decrypted);
    return code >= 32 && code <= 126 ? String.fromCharCode(code) : '?';
  });

  resultArea.textContent = decryptedChars.join("");
}
function clearRSA() {
  document.getElementById("rsaInput").value = "";
  document.getElementById("rsaResult").textContent = "";
  document.getElementById("rsaPublicKey").textContent = "";
  document.getElementById("rsaPrivateKey").textContent = "";
}

