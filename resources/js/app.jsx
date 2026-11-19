import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Classes from './pages/Classes';

export default function App() {
    const [activePage, setActivePage] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'students', label: 'Students' },
        { id: 'classes', label: 'Classes' },
    ];

    return (
        <div className="min-h-screen">
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Student Class Management
                        </h1>
                    </div>

                    <nav className="flex gap-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActivePage(item.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    activePage === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activePage === 'dashboard' && <Dashboard />}
                {activePage === 'students' && <Students />}
                {activePage === 'classes' && <Classes />}
            </main>
        </div>
    );
}
