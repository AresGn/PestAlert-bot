// Mock data for usage charts
export default function handler(req, res) {
    const mockData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Daily Active Users',
                data: [120, 150, 180, 140, 200, 220],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            },
            {
                label: 'Page Views',
                data: [800, 950, 1100, 900, 1300, 1450],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }
        ],
        period: 'last_6_months',
        totalUsage: 5500,
        averageDaily: 183
    };
    res.json({ success: true, data: mockData });
}
