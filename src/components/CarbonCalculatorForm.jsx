import { useState } from 'react';
import { Truck, Ship, Plane, Train, Package, PlusCircle } from 'lucide-react';
import LocationSelect from './LocationSelect';

export default function CarbonCalculatorForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    quantity: '',
    unit: 'pallets',
    tonnesPerUnit: '',
    cooledTransport: false,
    transportMode: '',
    fuelTypes: {
      diesel: false,
      cng: false,
      bev: false,
      hvo: false
    },
    origin: '',
    destination: '',
    originCoords: null,
    destinationCoords: null,
    originDetails: null,
    destinationDetails: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name] && showValidation) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleTransportMode = (mode) => {
    debugger;
    setFormData(prev => ({
      ...prev,
      transportMode: mode,
      fuelTypes: {
        diesel: false,
        cng: false,
        bev: false,
        hvo: false
      }
    }));
    setTouched(prev => ({ ...prev, transportMode: true }));
    if (showValidation) {
      setErrors(prev => ({ ...prev, transportMode: '', fuelTypes: '' }));
    }
  };

  const handleFuelTypeChange = (fuelType) => {
    setFormData(prev => ({
      ...prev,
      fuelTypes: {
        ...prev.fuelTypes,
        [fuelType]: !prev.fuelTypes[fuelType]
      }
    }));
  };
  // here we will add validation for the form fields before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity is required and must be greater than 0';
    }

    if (!formData.tonnesPerUnit || formData.tonnesPerUnit <= 0) {
      newErrors.tonnesPerUnit = 'Tonnes per unit is required and must be greater than 0';
    } else if (formData.tonnesPerUnit > 1000) {
      newErrors.tonnesPerUnit = 'Tonnes per unit seems too high';
    }

    if (!formData.transportMode) {
      newErrors.transportMode = 'Please select a transport mode';
    }

    // if (formData.transportMode === 'truck') {
    //   const hasFuelType = Object.values(formData.fuelTypes).some(value => value);
    //   if (!hasFuelType) {
    //     newErrors.fuelTypes = 'Please select at least one fuel type for truck transport';
    //   }
    // }

    if (!formData.origin || formData.origin.trim().length < 2) {
      newErrors.origin = 'Origin location is required';
    }

    if (!formData.destination || formData.destination.trim().length < 2) {
      newErrors.destination = 'Destination location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setShowValidation(true);

    setTouched({
      quantity: true,
      tonnesPerUnit: true,
      transportMode: true,
      origin: true,
      destination: true
    });

    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        setGeneralError(error.message || 'Failed to calculate carbon footprint');
      }
    }
  };

  const transportModes = [
  
    { id: 'ship', icon: Ship, label: 'Ship' },
    { id: 'plane', icon: Plane, label: 'Plane' },
    { id: 'train', icon: Train, label: 'Train' },
    { id: 'intermodal', icon: Package, label: 'Intermodal' }
  ];

  const unitOptions = [
    { value: 'pallets', label: 'Pallets' },
    { value: 'containers', label: 'Containers' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'pieces', label: 'Pieces' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {generalError}
        </div>
      )}

      {/* First Section - Quantity, Unit, Tonnes */}
      <div className="rounded-lg p-6 bg-white shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={() => handleBlur('quantity')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quantity"
              required
              min="1"
              step="1"
            />
            {showValidation && errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Unit Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {unitOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tonnes per Unit Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tonnes per Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tonnesPerUnit"
              value={formData.tonnesPerUnit}
              onChange={handleChange}
              onBlur={() => handleBlur('tonnesPerUnit')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="t"
            
              required
              maxLength={2}
               max={10}
              min="1"
              step="1"
            />
            {showValidation && errors.tonnesPerUnit && (
              <p className="text-red-500 text-sm mt-1">{errors.tonnesPerUnit}</p>
            )}
          </div>
        </div>

        {/* Cooled Transport Checkbox */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="cooledTransport"
            checked={formData.cooledTransport}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Cooled Transport</span>
        </label>
      </div>

      {/* Transport Mode Section */}
      <div className="rounded-lg p-6 bg-white shadow-md border border-gray-200">
        <label className="block text-sm font-semibold mb-4 text-gray-700">
          Choose Transport Mode <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Truck with Fuel Types */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleTransportMode('truck')}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition ${
                formData.transportMode === 'Ship'
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
            >
              <Truck 
                size={28} 
                className={formData.transportMode === 'Ship' ? 'text-white' : 'text-gray-600'} 
              />
            </button>

            {/* Fuel Type Checkboxes */}
       
          </div>

          {/* Other Transport Modes */}
          {transportModes.slice().map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleTransportMode(id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition ${
                formData.transportMode === id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
            >
              <Icon 
                size={28} 
                className={formData.transportMode === id ? 'text-blue-600' : 'text-gray-600'} 
              />
            </button>
          ))}
        </div>

        {showValidation && errors.transportMode && (
          <p className="text-red-500 text-sm mb-2">{errors.transportMode}</p>
        )}
        {showValidation && errors.fuelTypes && formData.transportMode === 'truck' && (
          <p className="text-red-500 text-sm">{errors.fuelTypes}</p>
        )}
      </div>

      {/* Origin and Destination Section */}
      <div className="rounded-lg p-6 bg-white shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>
        <div className="space-y-4">
          {/* Origin Location Select */}
          <LocationSelect
            label="Origin Location"
            placeholder="Search origin city..."
            value={formData.origin}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, origin: val }));
              if (errors.origin && showValidation) {
                setErrors(prev => ({ ...prev, origin: '' }));
              }
            }}
            onSelect={(location) => {
              console.log('Selected origin:', location);
              setFormData(prev => ({
                ...prev,
                origin: `${location.name}, ${location.country}`,
                originCoords: { 
                  lat: location.latitude, 
                  lng: location.longitude 
                },
                originDetails: location
              }));
            }}
            error={showValidation ? errors.origin : ''}
            required
          />

          {/* Destination Location Select */}
          <LocationSelect
            label="Destination Location"
            placeholder="Search destination city..."
            value={formData.destination}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, destination: val }));
              if (errors.destination && showValidation) {
                setErrors(prev => ({ ...prev, destination: '' }));
              }
            }}
            onSelect={(location) => {
              console.log('Selected destination:', location);
              setFormData(prev => ({
                ...prev,
                destination: `${location.name}, ${location.country}`,
                destinationCoords: { 
                  lat: location.latitude, 
                  lng: location.longitude 
                },
                destinationDetails: location
              }));
            }}
            error={showValidation ? errors.destination : ''}
            required
          />
        </div>

       
      </div>

      {/* Calculate Button */}
      <div className="text-center">
        <button
          type="submit"
          id='carboncalculate-id'
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Calculating...' : ' Evaluate Footprint'}
        </button>
      </div>
    </form>
  );
}
