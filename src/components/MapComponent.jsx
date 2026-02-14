// components/MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit bounds when markers change
const FitBounds = ({ originCoords, destinationCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (originCoords && destinationCoords) {
      const bounds = L.latLngBounds(
        [originCoords.lat, originCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (originCoords) {
      map.setView([originCoords.lat, originCoords.lng], 10);
    } else if (destinationCoords) {
      map.setView([destinationCoords.lat, destinationCoords.lng], 10);
    }
  }, [originCoords, destinationCoords, map]);

  return null;
};

const MapComponent = ({ 
  originCoords, 
  destinationCoords, 
  onOriginChange, 
  onDestinationChange 
}) => {
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const provider = new OpenStreetMapProvider();
  const originTimeoutRef = useRef(null);
  const destinationTimeoutRef = useRef(null);

  const defaultCenter = [20.5937, 78.9629]; // Center of world/India
  const defaultZoom = 4;

  // Search for origin location
  const searchOrigin = async (query) => {
    if (query.length < 3) {
      setOriginSuggestions([]);
      return;
    }

    try {
      const results = await provider.search({ query });
      setOriginSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error('Error searching origin:', error);
    }
  };

  // Search for destination location
  const searchDestination = async (query) => {
    if (query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    try {
      const results = await provider.search({ query });
      setDestinationSuggestions(results.slice(0, 5));
    } catch (error) {
      console.error('Error searching destination:', error);
    }
  };

  // Debounced search for origin
  const handleOriginSearchChange = (e) => {
    const value = e.target.value;
    setOriginSearch(value);
    setShowOriginSuggestions(true);

    if (originTimeoutRef.current) {
      clearTimeout(originTimeoutRef.current);
    }

    originTimeoutRef.current = setTimeout(() => {
      searchOrigin(value);
    }, 300);
  };

  // Debounced search for destination
  const handleDestinationSearchChange = (e) => {
    const value = e.target.value;
    setDestinationSearch(value);
    setShowDestinationSuggestions(true);

    if (destinationTimeoutRef.current) {
      clearTimeout(destinationTimeoutRef.current);
    }

    destinationTimeoutRef.current = setTimeout(() => {
      searchDestination(value);
    }, 300);
  };

  // Select origin from suggestions
  const selectOrigin = (result) => {
    setOriginSearch(result.label);
    setShowOriginSuggestions(false);
    setOriginSuggestions([]);

    onOriginChange({
      name: result.label,
      coords: {
        lat: result.y,
        lng: result.x
      },
      details: {
        city: result.raw?.address?.city || result.raw?.address?.town || '',
        country: result.raw?.address?.country || ''
      }
    });
  };

  // Select destination from suggestions
  const selectDestination = (result) => {
    setDestinationSearch(result.label);
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);

    onDestinationChange({
      name: result.label,
      coords: {
        lat: result.y,
        lng: result.x
      },
      details: {
        city: result.raw?.address?.city || result.raw?.address?.town || '',
        country: result.raw?.address?.country || ''
      }
    });
  };

  // Create route line between origin and destination
  const routePositions = originCoords && destinationCoords 
    ? [
        [originCoords.lat, originCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      ]
    : [];

  return (
    <div className="map-wrapper">
      {/* Search Inputs */}
      <div style={{ marginBottom: '20px' }}>
        {/* Origin Search */}
       

     
      </div>

      {/* Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin Marker */}
        {originCoords && (
          <Marker position={[originCoords.lat, originCoords.lng]} icon={originIcon}>
            <Popup>
              <strong>Origin</strong><br />
              {originSearch}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
            <Popup>
              <strong>Destination</strong><br />
              {destinationSearch}
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routePositions.length > 0 && (
          <Polyline 
            positions={routePositions} 
            color="#2196F3" 
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {/* Auto-fit bounds */}
        <FitBounds originCoords={originCoords} destinationCoords={destinationCoords} />
      </MapContainer>

      {/* Distance Display */}
      {originCoords && destinationCoords && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <strong>📏 Straight-line Distance:</strong> {calculateDistance(originCoords, destinationCoords)} km
        </div>
      )}
    </div>
  );
};

// Helper function to calculate distance
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance.toFixed(2);
};

export default MapComponent;