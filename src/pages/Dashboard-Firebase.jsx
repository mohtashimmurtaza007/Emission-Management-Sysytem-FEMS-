import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Calculator, History } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">FEMS</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Calculator Button */}
            <button
              onClick={() => navigate('/calculator')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </button>

            {/* History Button */}
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">{currentUser?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Welcome to FEMS! 🎉
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Authentication Working!</h3>
              <p className="text-green-700 text-sm">
                You're successfully logged in with Firebase Authentication. No more Clerk errors!
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📧 Your Account</h3>
              <p className="text-blue-700 text-sm">
                Email: <span className="font-mono">{currentUser?.email}</span>
              </p>
              <p className="text-blue-700 text-sm">
                User ID: <span className="font-mono text-xs">{currentUser?.uid}</span>
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🧮 Carbon Calculator</h3>
              <p className="text-purple-700 text-sm mb-3">
                Calculate the carbon footprint of your shipments with real distance calculations and automatic database storage.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/calculator')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Open Calculator
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <History className="w-4 h-4" />
                  View History
                </button>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">🚀 Features</h3>
              <ul className="text-orange-700 text-sm space-y-1 ml-4 list-disc">
                <li>Real-time city search with coordinates</li>
                <li>Accurate distance calculation using Haversine formula</li>
                <li>Multiple transport modes and fuel types</li>
                <li>Automatic database storage in Firebase Firestore</li>
                <li>View your calculation history and statistics</li>
                <li>Environmental impact with trees needed to offset</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
