import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X } from 'lucide-react';

export default function LocationSelect({ 
  label, 
  value, 
  onChange, 
  onSelect,
  error, 
  placeholder = "Search for a city...",
  required = false 
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch locations from API
  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        // Using Open-Meteo Geocoding API (free, no auth required)
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue)}&count=10&language=en`
        );
        const data = await response.json();
        
        console.log('Geocoding API response:', data);
        
        if (data.results) {
          const formatted = data.results.map((loc) => ({
            name: loc.name,
            country: loc.country,
            countryCode: loc.country_code,
            latitude: loc.latitude,
            longitude: loc.longitude,
            admin1: loc.admin1 || '',
            displayName: `${loc.name}${loc.admin1 ? ', ' + loc.admin1 : ''}, ${loc.country}`
          }));
          setSuggestions(formatted);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchLocations, 500); // Debounce
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input when value prop changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowDropdown(true);
    setSelectedLocation(null);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setInputValue(location.displayName);
    onChange(location.displayName);
    setShowDropdown(false);
    
    if (onSelect) {
      onSelect({
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        latitude: location.latitude,
        longitude: location.longitude,
        admin1: location.admin1
      });
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedLocation(null);
    onChange('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          required={required}
        />

        {/* Loading/Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {loading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Dropdown Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={`${location.latitude}-${location.longitude}-${index}`}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-3 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {location.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {location.admin1 && `${location.admin1}, `}
                  {location.country}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && !loading && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
          No locations found for "{inputValue}"
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900">{selectedLocation.name}</div>
              <div className="text-blue-700">
                {selectedLocation.admin1 && `${selectedLocation.admin1}, `}
                {selectedLocation.country}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                📍 {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
