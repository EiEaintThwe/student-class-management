import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    class_id: '',
};

export default function Students() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [search, classFilter, currentPage]);

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (error) {
            setErrorMessage('Unable to load classes.');
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setErrorMessage('');

            const response = await api.get('/students', {
                params: {
                    search,
                    class_id: classFilter,
                    page: currentPage,
                },
            });

            setStudents(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            setErrorMessage('Unable to load students.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: '',
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setErrors({});
        setEditingId(null);
        setShowForm(false);
    };

    const handleAdd = () => {
        setForm(initialForm);
        setEditingId(null);
        setErrors({});
        setShowForm(true);
        setMessage('');
    };

    const handleEdit = (student) => {
        setForm({
            name: student.name,
            email: student.email,
            phone: student.phone || '',
            class_id: String(student.class_id),
        });

        setEditingId(student.id);
        setErrors({});
        setShowForm(true);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setErrors({});
            setMessage('');
            setErrorMessage('');

            if (editingId) {
                await api.put(`/students/${editingId}`, form);
                setMessage('Student updated successfully.');
            } else {
                await api.post('/students', form);
                setMessage('Student created successfully.');
            }

            resetForm();
            setCurrentPage(1);

            await fetchStudents();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                setErrorMessage(
                    error.response.data.message || 'Please check the form.'
                );
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this student?'
        );

        if (!confirmed) return;

        try {
            setMessage('');
            setErrorMessage('');

            await api.delete(`/students/${id}`);

            setMessage('Student deleted successfully.');

            if (students.length === 1 && currentPage > 1) {
                setCurrentPage((page) => page - 1);
            } else {
                await fetchStudents();
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Unable to delete student.'
            );
        }
    };

    const getFieldError = (field) => {
        return errors[field]?.[0];
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Students</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage student information.
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
                >
                    + Add Student
                </button>
            </div>

            {message && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
                    {message}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                    {errorMessage}
                </div>
            )}

            {showForm && (
                <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-5">
                        {editingId ? 'Edit Student' : 'Add New Student'}
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Student Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2.5"
                                    placeholder="Enter student name"
                                />

                                {getFieldError('name') && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {getFieldError('name')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2.5"
                                    placeholder="Enter email address"
                                />

                                {getFieldError('email') && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {getFieldError('email')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2.5"
                                    placeholder="Enter phone number"
                                />

                                {getFieldError('phone') && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {getFieldError('phone')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Class *
                                </label>

                                <select
                                    name="class_id"
                                    value={form.class_id}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2.5 bg-white"
                                >
                                    <option value="">Select Class</option>

                                    {classes.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                                {getFieldError('class_id') && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {getFieldError('class_id')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId
                                    ? 'Update Student'
                                    : 'Save Student'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}


            <div className="bg-white border rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="flex-1 border rounded-lg px-3 py-2"
                />

                <select
                    value={classFilter}
                    onChange={(e) => {
                        setClassFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border rounded-lg px-3 py-2 bg-white"
                >
                    <option value="">All Classes</option>

                    {classes.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-5 py-4">#</th>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Phone</th>
                                <th className="px-5 py-4">Class</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        Loading students...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {student.name}
                                        </td>

                                        <td className="px-5 py-4">
                                            {student.email}
                                        </td>

                                        <td className="px-5 py-4">
                                            {student.phone || '-'}
                                        </td>

                                        <td className="px-5 py-4">
                                            {student.school_class?.name || '-'}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(student.id)}
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

                <div className="border-t px-5 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {currentPage} of {lastPage}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={currentPage <= 1 || loading}
                            onClick={() => setCurrentPage((page) => page - 1)}
                            className="border px-3 py-1.5 rounded disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            disabled={currentPage >= lastPage || loading}
                            onClick={() => setCurrentPage((page) => page + 1)}
                            className="border px-3 py-1.5 rounded disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
