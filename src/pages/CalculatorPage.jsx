import { useState } from 'react';
import CarbonCalculatorForm from '../components/CarbonCalculatorForm';
import { Calculator, MapPin, Navigation } from 'lucide-react';

export default function CalculatorPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const handleCalculate = async (formData) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate total weight
      const totalWeight = formData.quantity * formData.tonnesPerUnit;
      
      // Calculate distance if coordinates are available
      let distance = 500; // Default fallback distance
      if (formData.originCoords && formData.destinationCoords) {
        distance = calculateDistance(
          formData.originCoords.lat,
          formData.originCoords.lng,
          formData.destinationCoords.lat,
          formData.destinationCoords.lng
        );
      }
      
      // Emission factors (kg CO2 per tonne-km)
      let emissionFactor = 0.1;
      
      switch(formData.transportMode) {
        case 'truck':
          // Base truck emission
          emissionFactor = 0.12;
          
          // Adjust based on fuel type (if multiple selected, use average)
          const selectedFuels = Object.keys(formData.fuelTypes).filter(
            key => formData.fuelTypes[key]
          );
          
          if (selectedFuels.length > 0) {
            const fuelFactors = {
              diesel: 0.12,
              cng: 0.10,
              bev: 0.04,
              hvo: 0.08
            };
            
            const avgFactor = selectedFuels.reduce((sum, fuel) => 
              sum + fuelFactors[fuel], 0
            ) / selectedFuels.length;
            
            emissionFactor = avgFactor;
          }
          break;
          
        case 'ship':
          emissionFactor = 0.04;
          break;
          
        case 'plane':
          emissionFactor = 0.5;
          break;
          
        case 'train':
          emissionFactor = 0.03;
          break;
          
        case 'intermodal':
          emissionFactor = 0.08;
          break;
          
        default:
          emissionFactor = 0.1;
      }
      
      // Add cooling factor (30% increase)
      if (formData.cooledTransport) {
        emissionFactor *= 1.3;
      }
      
      // Calculate total carbon footprint
      const carbonFootprint = totalWeight * distance * emissionFactor;
      
      // Calculate trees needed to offset (1 tree absorbs ~21 kg CO2 per year)
      const treesNeeded = Math.ceil(carbonFootprint / 21);
      
      setResult({
        carbonFootprint: carbonFootprint.toFixed(2),
        totalWeight: totalWeight.toFixed(2),
        distance: distance.toFixed(2),
        transportMode: formData.transportMode,
        treesNeeded: treesNeeded,
        emissionFactor: emissionFactor.toFixed(4),
        formData: formData
      });
      
      setLoading(false);
    }, 1500);
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
            Carbon Footprint Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate the environmental impact of your shipments
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <CarbonCalculatorForm onSubmit={handleCalculate} loading={loading} />
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calculation Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Carbon Footprint */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-2">
                  Total Carbon Footprint
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
                {result.formData.cooledTransport && (
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
            {result.formData.originCoords && result.formData.destinationCoords && (
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
                      {result.formData.originDetails && (
                        <p className="text-xs text-blue-600 mt-1">
                          📍 {result.formData.originCoords.lat.toFixed(4)}, {result.formData.originCoords.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Destination</p>
                      <p className="text-blue-900 font-semibold">{result.formData.destination}</p>
                      {result.formData.destinationDetails && (
                        <p className="text-xs text-blue-600 mt-1">
                          📍 {result.formData.destinationCoords.lat.toFixed(4)}, {result.formData.destinationCoords.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipment Details */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Shipment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {result.formData.quantity} {result.formData.unit}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Weight per Unit:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {result.formData.tonnesPerUnit} tonnes
                  </span>
                </div>
                {result.formData.transportMode === 'truck' && (
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

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
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
