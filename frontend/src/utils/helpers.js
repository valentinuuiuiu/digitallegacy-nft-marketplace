// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show notification toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast p-4 mb-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'error' ? 'bg-red-500' :
        type === 'success' ? 'bg-green-500' :
        'bg-blue-500'
    }`;
    toast.textContent = message;

    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Shorten ethereum address
function shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Format ETH value
function formatEth(value) {
    return parseFloat(value).toFixed(4) + ' ETH';
}

// Export utilities
window.utils = {
    showError,
    showSuccess,
    showToast,
    shortenAddress,
    formatDate,
    formatEth
};
