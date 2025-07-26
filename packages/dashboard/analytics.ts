// Mock data for analytics
export default function handler(req, res) {
    const mockData = {
        totalUsers: 1000,
        activeUsers: 150,
        newSignups: 25
    };
    res.json({ success: true, data: mockData });
}
