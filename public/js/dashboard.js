document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardStats();
    initChart();

    // Refresh data every 10 seconds
    setInterval(fetchDashboardStats, 10000);
});

async function fetchDashboardStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // Update the UI Elements
        document.getElementById('total-transactions').innerText = data.totalTransactions.toLocaleString();
        document.getElementById('frauds-detected').innerText = data.fraudsDetected.toLocaleString();
        document.getElementById('risk-score').innerText = `${data.globalRiskScore}%`;

        // Update the progress bar width
        document.getElementById('risk-bar').style.width = `${data.globalRiskScore}%`;

    } catch (err) {
        console.error('Error fetching stats:', err);
        document.getElementById('total-transactions').innerText = 'Error';
    }
}

function initChart() {
    const ctx = document.getElementById('fraudChart').getContext('2d');

    // Simple placeholder chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
            datasets: [{
                label: 'Fraud Probability',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#d946ef',
                backgroundColor: 'rgba(217, 70, 239, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}