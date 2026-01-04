document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const amountInput = document.getElementById('amount');
    const continueBtn = document.getElementById('continue-btn');
    const pinOverlay = document.getElementById('pinOverlay');
    const errorMsg = document.getElementById('error-msg');

    continueBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim().replace('@', '');
        const amount = parseFloat(amountInput.value);

        // Validation Logic
        if (username.length < 3) {
            showError("Please enter a valid username");
        } else if (isNaN(amount) || amount < 100) {
            showError("Minimum transfer is ₦100.00");
        } else {
            // Success: Show PIN Overlay
            errorMsg.style.visibility = 'hidden';
            document.getElementById('confirmAmountDisplay').innerText = `₦${amount.toLocaleString()}`;
            
            // We store the username to use in the final redirect
            window.pendingTransfer = { username, amount };
            
            pinOverlay.style.display = 'flex';
            document.querySelectorAll('.pin-digit')[0].focus();
        }
    });

    // Final Payout Logic inside PIN verification
    document.getElementById('finalVerifyBtn').addEventListener('click', async () => {
        const pin = Array.from(document.querySelectorAll('.pin-digit')).map(d => d.value).join('');
        
        if (pin.length === 6) {
            const { username, amount } = window.pendingTransfer;
            const ref = Date.now();
            const formattedAmt = amount.toFixed(2);
            
            // Signature now includes the username for extra security
            const signature = await generateSignature(`${username}|${formattedAmt}`, ref);

            // Redirect with username included
            window.location.href = `https://techbydigitalsolution.com/transfer/?user=${username}&amt=${formattedAmt}&ref=${ref}&sig=${signature}`;
        }
    });

    function showError(text) {
        errorMsg.innerText = text;
        errorMsg.style.visibility = 'visible';
    }
});
