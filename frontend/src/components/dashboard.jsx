import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { itemAPI } from '../api/itemApi';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [items, setItems] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsResponse, statsResponse] = await Promise.all([
                itemAPI.getItems(),
                itemAPI.getStats()
            ]);
            setItems(itemsResponse.data.items);
            setStats(statsResponse.data.stats);
        } catch (error) {
            setError('Failed to fetch data');
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await itemAPI.createItem(formData);
            setSuccess('Item created successfully');
            setFormData({ title: '', description: '', status: 'active' });
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create item');
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await itemAPI.updateItem(editingItem.id, formData);
            setSuccess('Item updated successfully');
            setEditingItem(null);
            setFormData({ title: '', description: '', status: 'active' });
            fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update item');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await itemAPI.deleteItem(id);
            setSuccess('Item deleted successfully');
            fetchData();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete item');
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            status: item.status
        });
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setFormData({ title: '', description: '', status: 'active' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Task Management Dashboard</h1>
                                <p className="text-sm text-gray-600">Organize and track your tasks efficiently</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
                            <p className="text-blue-100">
                                Manage your tasks, track progress, and stay organized with your personal dashboard.
                                Create new tasks, update their status, and monitor your productivity.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">T</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">A</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">P</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">C</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Add Item Button */}
                <div className="mb-6">
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingItem(null);
                            setFormData({ title: '', description: '', status: 'active' });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        {showAddForm ? 'Cancel' : 'Add New Item'}
                    </button>
                </div>

                {/* Add/Edit Item Form */}
                {(showAddForm || editingItem) && (
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <form onSubmit={editingItem ? handleEditItem : handleAddItem}>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    {editingItem ? 'Update Item' : 'Create Item'}
                                </button>
                                {editingItem && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Items List */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Items</h3>
                        {items.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No items found. Create your first item!</p>
                        ) : (
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {item.description || 'No description'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <select
                                                        value={item.status}
                                                        onChange={async (e) => {
                                                            try {
                                                                await itemAPI.updateItem(item.id, { status: e.target.value });
                                                                fetchData();
                                                            } catch {
                                                                setError('Failed to update status');
                                                            }
                                                        }}
                                                        className="mr-3 text-xs border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
