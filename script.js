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

// RSA Cipher Implementation
let publicKey = null;
let privateKey = null;

// Utility Functions
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Extended Euclidean Algorithm to find modular inverse
function extendedGCD(a, b) {
    if (a === 0) {
        return { gcd: b, x: 0, y: 1 };
    }
    
    const result = extendedGCD(b % a, a);
    const x = result.y - Math.floor(b / a) * result.x;
    const y = result.x;
    
    return { gcd: result.gcd, x: x, y: y };
}

function modInverse(e, phi) {
    const result = extendedGCD(e, phi);
    if (result.gcd !== 1) {
        return null; // Modular inverse doesn't exist
    }
    return ((result.x % phi) + phi) % phi;
}

// Fast modular exponentiation
function modPow(base, exp, mod) {
    if (mod === 1) return 0;
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Manual key setting function
function setManualKeys() {
    const n = parseInt(document.getElementById('manualN').value);
    const e = parseInt(document.getElementById('manualE').value);
    const d = parseInt(document.getElementById('manualD').value);
    
    if (!n || !e || !d) {
        updateSteps('Please enter all three values: n, e, and d.');
        return;
    }
    
    if (n <= 0 || e <= 0 || d <= 0) {
        updateSteps('All key values must be positive integers.');
        return;
    }
    
    // Basic validation: check if e and d are valid
    if (e >= n || d >= n) {
        updateSteps('Warning: e and d should typically be less than n.');
    }
    
    // Set the keys
    publicKey = { n: n, e: e };
    privateKey = { n: n, d: d };
    
    document.getElementById('rsaPublicKey').textContent = `(${n}, ${e})`;
    document.getElementById('rsaPrivateKey').textContent = `(${n}, ${d})`;
    
    const steps = `Manual key setup:
Public key: (n=${n}, e=${e})
Private key: (n=${n}, d=${d})

Note: Make sure these keys are mathematically correct:
- n should be the product of two large primes
- e should be coprime to φ(n)
- d should be the modular inverse of e mod φ(n)
- e × d ≡ 1 (mod φ(n))`;
    
    updateSteps(steps);
}

// Function to toggle between prime generation and manual key input
function toggleKeyMethod() {
    const primesMethod = document.getElementById('primesMethod').checked;
    const primesSection = document.getElementById('primesSection');
    const manualSection = document.getElementById('manualSection');
    
    if (primesMethod) {
        primesSection.style.display = 'grid';
        manualSection.style.display = 'none';
    } else {
        primesSection.style.display = 'none';
        manualSection.style.display = 'grid';
    }
}
function generateSmallPrimes() {
    const primes = [];
    for (let i = 3; i < 100; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return primes;
}

function generateRandomKeys() {
    const primes = generateSmallPrimes();
    const p = primes[Math.floor(Math.random() * primes.length)];
    let q = primes[Math.floor(Math.random() * primes.length)];
    
    // Ensure p and q are different
    while (q === p) {
        q = primes[Math.floor(Math.random() * primes.length)];
    }
    
    document.getElementById('primeP').value = p;
    document.getElementById('primeQ').value = q;
    
    // Automatically generate keys after setting primes
    generateKeys();
}

function generateKeys() {
    const keyMethod = document.querySelector('input[name="keyMethod"]:checked').value;
    
    if (keyMethod === 'primes') {
        generateKeysFromPrimes();
    } else {
        setManualKeys();
    }
}

function generateKeysFromPrimes() {
    const pInput = parseInt(document.getElementById('primeP').value);
    const qInput = parseInt(document.getElementById('primeQ').value);
    
    if (!pInput || !qInput) {
        updateSteps('Please enter both prime numbers p and q.');
        return;
    }
    
    if (!isPrime(pInput) || !isPrime(qInput)) {
        updateSteps('Both p and q must be prime numbers!');
        return;
    }
    
    if (pInput === qInput) {
        updateSteps('p and q must be different prime numbers!');
        return;
    }
    
    const p = pInput;
    const q = qInput;
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // For textbook example (p=43, q=59), use e=13
    let e;
    if (p === 43 && q === 59) {
        e = 13;
    } else if (p === 59 && q === 43) {
        e = 13;
    } else {
        // Find e (commonly 65537 or 3, but we'll find a suitable one)
        e = 3;
        while (gcd(e, phi) !== 1) {
            e += 2;
            if (e >= phi) {
                updateSteps('Cannot find suitable e. Try different primes.');
                return;
            }
        }
    }
    
    // Verify gcd(e, phi) = 1
    if (gcd(e, phi) !== 1) {
        updateSteps(`Error: gcd(${e}, ${phi}) ≠ 1. Cannot use e = ${e}.`);
        return;
    }
    
    // Calculate d (private key exponent)
    const d = modInverse(e, phi);
    if (d === null) {
        updateSteps('Cannot calculate private key. Try different primes.');
        return;
    }
    
    publicKey = { n: n, e: e };
    privateKey = { n: n, d: d };
    
    document.getElementById('rsaPublicKey').textContent = `(${n}, ${e})`;
    document.getElementById('rsaPrivateKey').textContent = `(${n}, ${d})`;
    
    const steps = `Step-by-step key generation:
1. Choose primes: p = ${p}, q = ${q}
2. Calculate n = p × q = ${p} × ${q} = ${n}
3. Calculate φ(n) = (p-1)(q-1) = ${p-1} × ${q-1} = ${phi}
4. Choose e = ${e} (gcd(${e}, ${phi}) = ${gcd(e, phi)})
5. Calculate d ≡ e⁻¹ (mod φ(n)) = ${d}
6. Public key: (${n}, ${e})
7. Private key: (${n}, ${d})`;
    
    updateSteps(steps);
}

function encryptRSA() {
    if (!publicKey) {
        updateResult('Please generate keys first!');
        return;
    }
    
    const message = document.getElementById('rsaInput').value.toUpperCase();
    if (!message) {
        updateResult('Please enter a message to encrypt!');
        return;
    }
    
    const { n, e } = publicKey;
    
    // Check if this is the textbook example
    if (n === 2537 && e === 13) {
        return encryptTextbookStyle(message, n, e);
    }
    
    // Regular character-by-character encryption
    let encrypted = [];
    let steps = 'Encryption process:\n';
    
    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        
        if (charCode >= n) {
            updateResult(`Error: Character '${message[i]}' (ASCII ${charCode}) is too large for modulus ${n}. Use smaller primes or shorter message.`);
            return;
        }
        
        const encryptedChar = modPow(charCode, e, n);
        encrypted.push(encryptedChar);
        
        steps += `'${message[i]}' → ${charCode} → ${charCode}^${e} mod ${n} = ${encryptedChar}\n`;
    }
    
    updateResult(`Encrypted: [${encrypted.join(', ')}]`);
    updateSteps(steps);
}

function encryptTextbookStyle(message, n, e) {
    // Convert letters to numbers (A=00, B=01, ..., Z=25)
    let numbers = '';
    let steps = 'Textbook-style encryption process:\n';
    steps += `Message: "${message}"\n\n`;
    
    // Step 1: Convert letters to 2-digit numbers
    steps += '1. Convert letters to numbers (A=00, B=01, ..., Z=25):\n';
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        if (char >= 'A' && char <= 'Z') {
            const num = char.charCodeAt(0) - 65; // A=0, B=1, etc.
            const twoDigit = num.toString().padStart(2, '0');
            numbers += twoDigit;
            steps += `${char} → ${twoDigit}\n`;
        } else if (char === ' ') {
            // Skip spaces or treat them as special case
            continue;
        }
    }
    
    steps += `\nCombined: ${numbers}\n\n`;
    
    // Step 2: Group into blocks (ensure each block < n)
    steps += '2. Group numbers into blocks (each block must be < 2537):\n';
    const blocks = [];
    
    // For the textbook example, group into 4-digit blocks
    for (let i = 0; i < numbers.length; i += 4) {
        let block = numbers.substr(i, 4);
        if (block.length < 4 && i + 4 >= numbers.length) {
            // Pad the last block if necessary
            block = block.padEnd(4, '0');
        }
        const blockNum = parseInt(block);
        if (blockNum < n) {
            blocks.push(blockNum);
            steps += `Block: ${block} → ${blockNum}\n`;
        } else {
            // If block is too large, split it differently
            updateResult(`Error: Block ${blockNum} is >= ${n}. Need different grouping.`);
            return;
        }
    }
    
    steps += `\nBlocks: [${blocks.join(', ')}]\n\n`;
    
    // Step 3: Encrypt each block
    steps += '3. Encrypt each block using c ≡ m^e (mod n):\n';
    const encrypted = [];
    
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const encryptedBlock = modPow(block, e, n);
        encrypted.push(encryptedBlock);
        steps += `${block}^${e} mod ${n} = ${encryptedBlock}\n`;
    }
    
    steps += `\nFinal encrypted message: [${encrypted.join(', ')}]`;
    
    // For STOP example, this should give us [1819, 1415] → [2081, 2182]
    updateResult(`Encrypted: [${encrypted.join(', ')}]`);
    updateSteps(steps);
}

function decryptRSA() {
    if (!privateKey) {
        updateResult('Please generate keys first!');
        return;
    }
    
    const input = document.getElementById('rsaInput').value.trim();
    if (!input) {
        updateResult('Please enter encrypted data to decrypt!');
        return;
    }
    
    const { n, d } = privateKey;
    
    // Parse encrypted data - expect format like "123,456,789" or "[123, 456, 789]"
    let encryptedData;
    try {
        // Remove brackets and split by comma
        const cleanInput = input.replace(/[\[\]]/g, '');
        encryptedData = cleanInput.split(',').map(x => parseInt(x.trim()));
        
        if (encryptedData.some(isNaN)) {
            throw new Error('Invalid format');
        }
    } catch (e) {
        updateResult('Invalid encrypted data format! Use format: 123,456,789 or [123, 456, 789]');
        return;
    }
    
    // Check if this is the textbook example
    if (n === 2537 && privateKey.e === 13) {
        return decryptTextbookStyle(encryptedData, n, d);
    }
    
    // Regular character-by-character decryption
    let decrypted = '';
    let steps = 'Decryption process:\n';
    
    for (let i = 0; i < encryptedData.length; i++) {
        const encryptedChar = encryptedData[i];
        const decryptedCharCode = modPow(encryptedChar, d, n);
        const decryptedChar = String.fromCharCode(decryptedCharCode);
        
        decrypted += decryptedChar;
        steps += `${encryptedChar} → ${encryptedChar}^${d} mod ${n} = ${decryptedCharCode} → '${decryptedChar}'\n`;
    }
    
    updateResult(`Decrypted: "${decrypted}"`);
    updateSteps(steps);
}

function decryptTextbookStyle(encryptedData, n, d) {
    let steps = 'Textbook-style decryption process:\n';
    steps += `Encrypted blocks: [${encryptedData.join(', ')}]\n\n`;
    
    // Step 1: Decrypt each block
    steps += '1. Decrypt each block using m ≡ c^d (mod n):\n';
    const decryptedBlocks = [];
    
    for (let i = 0; i < encryptedData.length; i++) {
        const encryptedBlock = encryptedData[i];
        const decryptedBlock = modPow(encryptedBlock, d, n);
        decryptedBlocks.push(decryptedBlock);
        steps += `${encryptedBlock}^${d} mod ${n} = ${decryptedBlock}\n`;
    }
    
    steps += `\nDecrypted blocks: [${decryptedBlocks.join(', ')}]\n\n`;
    
    // Step 2: Convert blocks back to 4-digit strings and combine
    steps += '2. Convert blocks back to 4-digit strings:\n';
    let combinedNumbers = '';
    
    for (let i = 0; i < decryptedBlocks.length; i++) {
        const block = decryptedBlocks[i];
        const fourDigitString = block.toString().padStart(4, '0');
        combinedNumbers += fourDigitString;
        steps += `${block} → ${fourDigitString}\n`;
    }
    
    steps += `\nCombined numbers: ${combinedNumbers}\n\n`;
    
    // Step 3: Convert pairs of digits back to letters
    steps += '3. Convert pairs of digits back to letters (00=A, 01=B, ..., 25=Z):\n';
    let decryptedMessage = '';
    
    for (let i = 0; i < combinedNumbers.length; i += 2) {
        const pair = combinedNumbers.substr(i, 2);
        const num = parseInt(pair);
        if (num >= 0 && num <= 25) {
            const letter = String.fromCharCode(65 + num); // A=65
            decryptedMessage += letter;
            steps += `${pair} → ${num} → ${letter}\n`;
        }
    }
    
    steps += `\nDecrypted message: "${decryptedMessage}"`;
    
    updateResult(`Decrypted: "${decryptedMessage}"`);
    updateSteps(steps);
}

function clearRSA() {
    document.getElementById('rsaInput').value = '';
    document.getElementById('primeP').value = '';
    document.getElementById('primeQ').value = '';
    document.getElementById('manualN').value = '';
    document.getElementById('manualE').value = '';
    document.getElementById('manualD').value = '';
    document.getElementById('rsaPublicKey').textContent = 'Not generated';
    document.getElementById('rsaPrivateKey').textContent = 'Not generated';
    updateResult('Result will appear here...');
    updateSteps('Steps will appear here...');
    
    publicKey = null;
    privateKey = null;
}

function updateResult(text) {
    document.getElementById('rsaResult').textContent = text;
}

function updateSteps(text) {
    document.getElementById('rsaSteps').textContent = text;
}

// Example with textbook values (STOP example)
function loadTextbookExample() {
    // Switch to primes method
    document.getElementById('primesMethod').checked = true;
    toggleKeyMethod();
    
    // Set the textbook values
    document.getElementById('primeP').value = '43';
    document.getElementById('primeQ').value = '59';
    generateKeysFromPrimes();
    
    // Set the message
    document.getElementById('rsaInput').value = 'STOP';
    
    updateSteps(`Textbook Example (p=43, q=59):
This matches the example from your textbook where:
- p = 43, q = 59
- n = 43 × 59 = 2537  
- φ(n) = 42 × 58 = 2436
- e = 13 (gcd(13, 2436) = 1)
- Expected result for "STOP": [2081, 2182]

The textbook method:
1. Convert letters: S=18, T=19, O=14, P=15
2. Make 2-digit: 18, 19, 14, 15
3. Group into 4-digit blocks: 1819, 1415
4. Encrypt: 1819^13 mod 2537 = 2081, 1415^13 mod 2537 = 2182

Click 'Encrypt' to see the full process!`);
}

// Auto-generate keys when both primes are entered

// Initialize event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for radio buttons
    document.getElementById('primesMethod').addEventListener('change', toggleKeyMethod);
    document.getElementById('manualMethod').addEventListener('change', toggleKeyMethod);
    
    // Add event listeners for input changes to auto-generate keys
    document.getElementById('primeP').addEventListener('input', autoGenerateFromPrimes);
    document.getElementById('primeQ').addEventListener('input', autoGenerateFromPrimes);
    document.getElementById('manualN').addEventListener('input', autoSetManualKeys);
    document.getElementById('manualE').addEventListener('input', autoSetManualKeys);
    document.getElementById('manualD').addEventListener('input', autoSetManualKeys);
});

// Auto-generate keys when both primes are entered
function autoGenerateFromPrimes() {
    const p = document.getElementById('primeP').value;
    const q = document.getElementById('primeQ').value;
    
    if (p && q && document.getElementById('primesMethod').checked) {
        generateKeysFromPrimes();
    }
}

// Auto-set keys when all manual values are entered
function autoSetManualKeys() {
    const n = document.getElementById('manualN').value;
    const e = document.getElementById('manualE').value;
    const d = document.getElementById('manualD').value;
    
    if (n && e && d && document.getElementById('manualMethod').checked) {
        setManualKeys();
    }
}
