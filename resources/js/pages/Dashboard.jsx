import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
    const [studentCount, setStudentCount] = useState(0);
    const [classCount, setClassCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError('');

            const [studentsResponse, classesResponse] = await Promise.all([
                api.get('/students'),
                api.get('/classes'),
            ]);

            setStudentCount(studentsResponse.data.total);
            setClassCount(classesResponse.data.length);
        } catch (error) {
            setError('Unable to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-gray-500">Loading dashboard...</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    const cards = [
        {
            title: 'Total Students',
            count: studentCount,
            description: 'Registered students',
        },
        {
            title: 'Total Classes',
            count: classCount,
            description: 'Available classes',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-gray-500 mt-1">
                    Overview of student management system.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white p-6 rounded-xl shadow-sm border"
                    >
                        <p className="text-gray-500 text-sm">
                            {card.title}
                        </p>

                        <h3 className="text-3xl font-bold mt-3">
                            {card.count}
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
