import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';

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
              <h3 className="font-semibold text-purple-900 mb-2">🚀 What's Next?</h3>
              <ul className="text-purple-700 text-sm space-y-1 ml-4 list-disc">
                <li>Build your application features</li>
                <li>Add more pages and components</li>
                <li>Connect to your backend API</li>
                <li>Deploy to production</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
