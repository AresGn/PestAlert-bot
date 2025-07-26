// Mock data for performance charts
export default function handler(req, res) {
    const mockData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Response Time (ms)',
                data: [120, 95, 150, 200, 180, 110],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1
            },
            {
                label: 'CPU Usage (%)',
                data: [45, 30, 65, 80, 70, 40],
                borderColor: 'rgb(255, 206, 86)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.1
            }
        ],
        metrics: {
            averageResponseTime: 142,
            uptimePercentage: 99.8,
            errorRate: 0.2,
            throughput: 1200
        },
        period: 'last_24_hours'
    };
    res.json({ success: true, data: mockData });
}
