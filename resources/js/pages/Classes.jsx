import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Classes() {
    const [classes, setClasses] = useState([]);

    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            setError('Unable to load classes.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setMessage('');

        if (!name.trim()) {
            setError('Class name is required.');
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                await api.put(`/classes/${editingId}`, {
                    name: name.trim(),
                });

                setMessage('Class updated successfully.');
            } else {
                await api.post('/classes', {
                    name: name.trim(),
                });

                setMessage('Class created successfully.');
            }

            setName('');
            setEditingId(null);

            await fetchClasses();
        } catch (error) {
            if (error.response?.status === 422) {
                setError(
                    error.response.data.errors?.name?.[0] ||
                    error.response.data.message ||
                    'Validation failed.'
                );
            } else {
                setError('Something went wrong.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setName(item.name);
        setError('');
        setMessage('');
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setError('');
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this class?'
        );

        if (!confirmed) return;

        setError('');
        setMessage('');

        try {
            await api.delete(`/classes/${id}`);

            setMessage('Class deleted successfully.');

            await fetchClasses();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to delete class.'
            );
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Classes</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Manage the classes.
                </p>
            </div>

            {message && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">
                    {editingId ? 'Edit Class' : 'Add New Class'}
                </h3>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter class name"
                        className="flex-1 border rounded-lg px-3 py-2.5"
                    />

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg"
                    >
                        {saving
                            ? 'Saving...'
                            : editingId
                            ? 'Update Class'
                            : 'Add Class'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>


            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-5 py-4">#</th>
                                <th className="px-5 py-4">Class Name</th>
                                <th className="px-5 py-4">Total Students</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8">
                                        Loading classes...
                                    </td>
                                </tr>
                            ) : classes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">
                                        No classes found.
                                    </td>
                                </tr>
                            ) : (
                                classes.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {item.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            {item.students_count}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
