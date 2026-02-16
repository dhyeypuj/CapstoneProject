// Function to fetch data from your MongoDB API
async function updateDashboardStats() {
    try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();

        // Update the UI Cards
        document.querySelector('#total-tx').innerText = data.totalTransactions.toLocaleString();
        document.querySelector('#fraud-count').innerText = data.fraudsDetected;
        document.querySelector('#risk-percent').innerText = `${Math.round(data.globalRiskScore)}%`;

        // Update the Risk Progress Bar width
        document.querySelector('#risk-bar').style.width = `${data.globalRiskScore}%`;
    } catch (err) {
        console.error("Failed to fetch live stats:", err);
    }
}

// Chart.js Setup (Refined for your purple/black aesthetic)
function initTrendChart() {
    const ctx = document.getElementById('fraudChart').getContext('2d');
    const purpleGrad = ctx.createLinearGradient(0, 0, 0, 400);
    purpleGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
    purpleGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
            datasets: [{
                label: 'Anomalies',
                data: [10, 25, 15, 40, 30, 55, 45], // Replace with DB data later
                borderColor: '#a855f7',
                borderWidth: 3,
                fill: true,
                backgroundColor: purpleGrad,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
            }
        }
    });
}

// Profile Dropdown Toggle
function initProfile() {
    const btn = document.querySelector('#profile-trigger');
    const menu = document.querySelector('#profile-menu');
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// Run everything
document.addEventListener('DOMContentLoaded', () => {
    initTrendChart();
    initProfile();
    updateDashboardStats();
    // Refresh stats every 30 seconds
    setInterval(updateDashboardStats, 30000);
});

async function fetchLiveStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        // Update the numbers on your dashboard cards
        // Ensure these IDs exist in your dashboard.ejs (e.g., <h3 id="total-transactions">)
        document.getElementById('total-transactions').innerText = data.totalTransactions.toLocaleString();
        document.getElementById('frauds-detected').innerText = data.fraudsDetected;
        document.getElementById('global-risk-score').innerText = Math.round(data.globalRiskScore) + '%';

        // Update the purple progress bar width
        const riskBar = document.getElementById('risk-bar');
        if (riskBar) riskBar.style.width = data.globalRiskScore + '%';

    } catch (error) {
        console.error('Error fetching live stats:', error);
    }
}

// Call it when the page loads
fetchLiveStats();
// Optional: Refresh every 30 seconds
setInterval(fetchLiveStats, 30000);