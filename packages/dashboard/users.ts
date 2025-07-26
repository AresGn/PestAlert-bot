// Mock data for users
export default function handler(req, res) {
    const mockData = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'Admin',
            status: 'active',
            lastLogin: '2025-01-26T10:00:00Z'
        },
        {
            id: 2,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'User',
            status: 'active',
            lastLogin: '2025-01-25T15:30:00Z'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'Moderator',
            status: 'inactive',
            lastLogin: '2025-01-24T09:15:00Z'
        }
    ];
    res.json({ success: true, data: mockData });
}
