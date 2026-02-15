import { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import CarbonCalculatorForm from '../components/CarbonCalculatorForm';
import { Calculator, MapPin, Navigation } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CalculatorPage() {
  const { currentUser } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const requestData = {
        userId: currentUser?.uid || 'anonymous',
        quantity: formData.quantity,
        unit: formData.unit,
        tonnesPerUnit: formData.tonnesPerUnit,
        cooledTransport: formData.cooledTransport,
        transportMode: formData.transportMode,
        fuelTypes: formData.fuelTypes,
        origin: formData.origin,
        destination: formData.destination,
        originCoords: formData.originCoords,
        destinationCoords: formData.destinationCoords,
        originDetails: formData.originDetails,
        destinationDetails: formData.destinationDetails
      };

      // Call backend API
      debugger;
      const response = await axios.post(`${API_URL}/api/calculate-carbon`, requestData);

      if (response.data.success) {
        setResult({
          ...response.data.data,
          calculationId: response.data.data.id,
          formData: formData
        });
      } else {
        setError(response.data.message || 'Calculation failed');
      }

    } catch (err) {
      console.error('Calculation error:', err);
      setError(err.response?.data?.message || 'Failed to calculate carbon footprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FEMS Operation
          </h1>
          <p className="text-gray-600 text-lg">
            FEMS the environmental impact of your shipments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <CarbonCalculatorForm onSubmit={handleCalculate} loading={loading} />
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">

                Statistic Results
              </h2>
              <div className="text-sm text-gray-500">
                ID: {result.calculationId}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Carbon Footprint */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-2">
                  Total Footprint
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {result.carbonFootprint}
                </p>
                <p className="text-sm text-green-600 mt-1">kg CO₂</p>
              </div>

              {/* Total Weight */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  Total Weight
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {result.totalWeight}
                </p>
                <p className="text-sm text-blue-600 mt-1">tonnes</p>
              </div>

              {/* Distance */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium mb-2">
                  Distance
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {result.distance}
                </p>
                <p className="text-sm text-purple-600 mt-1">km</p>
              </div>

              {/* Transport Mode */}
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 font-medium mb-2">
                  Transport Mode
                </p>
                <p className="text-2xl font-bold text-orange-900 capitalize">
                  {result.transportMode}
                </p>
                {result.cooledTransport && (
                  <p className="text-sm text-orange-600 mt-1">+ Cooling</p>
                )}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                Environmental Impact
              </h3>
              <p className="text-emerald-800 text-lg mb-2">
                This shipment produces <span className="font-bold">{result.carbonFootprint} kg CO₂</span>
              </p>
              <p className="text-emerald-700">
                You would need approximately <span className="font-bold text-xl">{result.treesNeeded} trees</span> for one year to offset this carbon footprint
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                Emission Factor: {result.emissionFactor} kg CO₂ per tonne-km
              </p>
            </div>

            {/* Route Information */}
            {result.formData?.originCoords && result.formData?.destinationCoords && (
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Route Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Origin</p>
                      <p className="text-blue-900 font-semibold">{result.formData.origin}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        📍 {result.formData.originCoords.lat.toFixed(4)}, {result.formData.originCoords.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Destination</p>
                      <p className="text-blue-900 font-semibold">{result.formData.destination}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        📍 {result.formData.destinationCoords.lat.toFixed(4)}, {result.formData.destinationCoords.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipment Details */}
            <div className="p-6 bg-gray-50 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Shipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {result.formData?.quantity} {result.formData?.unit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Weight per Unit:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {result.formData?.tonnesPerUnit} tonnes
                  </span>
                </div>
                {result.transportMode === 'truck' && result.formData?.fuelTypes && (
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Fuel Types:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {Object.keys(result.formData.fuelTypes)
                        .filter(key => result.formData.fuelTypes[key])
                        .map(fuel => fuel.toUpperCase())
                        .join(', ') || 'None selected'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* ============ NEW: COST DISPLAY ============ */}
            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
              <strong style={{ color: '#666' }}>Transport Cost</strong>
              <p style={{ fontSize: '24px', color: '#f57c00', margin: '5px 0', fontWeight: 'bold' }}>
                ${result.transportCost?.toLocaleString()}
              </p>
              <small style={{ color: '#666' }}>Shipping fee</small>
            </div>

            <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
              <strong style={{ color: '#666' }}>Carbon Offset</strong>
              <p style={{ fontSize: '24px', color: '#f57c00', margin: '5px 0', fontWeight: 'bold' }}>
                ${result.carbonOffsetCost?.toLocaleString()}
              </p>
              <small style={{ color: '#666' }}>Environmental fee</small>
            </div>

            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '2px solid #f57c00' }}>
              <strong style={{ color: '#666' }}>Total Cost</strong>
              <p style={{ fontSize: '28px', color: '#e65100', margin: '5px 0', fontWeight: 'bold' }}>
                ${result.totalCost?.toLocaleString()}
              </p>
              <small style={{ color: '#666' }}>{result.currency || 'USD'}</small>
            </div>
            {/* ========================================== */}


            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Calculate Another
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
