document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const continueBtn = document.getElementById('continue-btn');
    const pinOverlay = document.getElementById('pinOverlay');
    const pinDigits = document.querySelectorAll('.pin-digit');
    const finalVerifyBtn = document.getElementById('finalVerifyBtn');
    
    const SHARED_SECRET = "secure-wallet-key-2026";
    const REDIRECT_URL = "https://techbydigitalsolution.com/transfer/";

    // Generate SHA-256 Signature
    async function generateSignature(amount, ref) {
        const message = `${amount}|${ref}|${SHARED_SECRET}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Step 1: Amount Validation -> Show PIN
    continueBtn.addEventListener('click', () => {
        const val = parseFloat(amountInput.value);
        if (val >= 1 && val <= 5000) {
            document.getElementById('confirmAmountDisplay').innerText = `$${val.toFixed(2)}`;
            pinOverlay.style.display = 'flex';
            pinDigits[0].focus();
        } else {
            document.getElementById('error-msg').style.visibility = 'visible';
        }
    });

    // Step 2: PIN Handling (Auto-focus & Masking)
    pinDigits.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < pinDigits.length - 1) {
                pinDigits[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinDigits[index - 1].focus();
            }
        });
    });

    // Step 3: Verify & Redirect
    finalVerifyBtn.addEventListener('click', async () => {
        const pin = Array.from(pinDigits).map(d => d.value).join('');
        if (pin.length === 6) {
            finalVerifyBtn.innerText = "Authorizing...";
            const amount = parseFloat(amountInput.value).toFixed(2);
            const ref = Date.now();
            const signature = await generateSignature(amount, ref);

            setTimeout(() => {
                window.location.href = `${REDIRECT_URL}?amt=${amount}&ref=${ref}&sig=${signature}`;
            }, 1000);
        } else {
            alert("Please enter full PIN");
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => pinOverlay.style.display = 'none');
});
