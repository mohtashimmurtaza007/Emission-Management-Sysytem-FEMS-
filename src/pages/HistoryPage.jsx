import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { carbonCalculatorAPI } from '../services/api';
import { History, Trash2, Eye, Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const { currentUser } = useAuth();
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchHistory();
      fetchStats();
    }
  }, [currentUser]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await carbonCalculatorAPI.getHistory(currentUser.uid, 50, 0);
      
      if (response.success) {
        setCalculations(response.data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load calculation history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await carbonCalculatorAPI.getStats(currentUser.uid);
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      const response = await carbonCalculatorAPI.deleteCalculation(id, currentUser.uid);
      
      if (response.success) {
        setCalculations(prev => prev.filter(calc => calc.id !== id));
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      console.error('Error deleting calculation:', err);
      alert('Failed to delete calculation');
    }
  };

 const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    // Handle Firestore timestamp
    const date = timestamp._seconds 
      ? new Date(timestamp._seconds * 1000) 
      : new Date(timestamp); // Handles ISO strings directly
    debugger
    // Validate the date
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <History className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
             FEMS Calculation History
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage your carbon footprint calculations
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Calculations</p>
              <p className="text-3xl font-bold text-blue-600">{stats.calculationCount}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Footprint</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalCarbonFootprint}</p>
              <p className="text-xs text-gray-500 mt-1">kg CO₂</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Distance</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalDistance}</p>
              <p className="text-xs text-gray-500 mt-1">km</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Trees Needed</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.treesNeeded}</p>
              <p className="text-xs text-gray-500 mt-1">to offset CO₂</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading calculations...</p>
          </div>
        ) : calculations.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Calculations Yet</h3>
            <p className="text-gray-600 mb-6">Start calculating carbon footprints to see your history here</p>
            <a
              href="/calculator"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Calculator
            </a>
          </div>
        ) : (
          // Calculations Table
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transport
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CO₂
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculations.map((calc) => (
                    <tr key={calc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(calc.calculatedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{calc.origin}</div>
                          <div className="text-gray-500 truncate">→ {calc.destination}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {calc.transportMode}
                        </span>
                        {calc.cooledTransport && (
                          <span className="ml-1 px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-medium">
                            Cooled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calc.totalWeight} t
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calc.distance} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {calc.carbonFootprint} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(calc.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
