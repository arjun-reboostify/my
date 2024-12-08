import React, { useState, useMemo } from 'react';
import { Car, Truck, Zap, Leaf, MapPin, Navigation } from 'lucide-react';

// Define fare rates per km
const VEHICLE_RATES = {
  petrol: { rate: 12, icon: Car, color: 'text-red-500' },
  diesel: { rate: 10, icon: Truck, color: 'text-gray-700' },
  electric: { rate: 9, icon: Zap, color: 'text-blue-500' },
  cng: { rate: 8, icon: Leaf, color: 'text-green-500' }
};

// Location data with enhanced geographical context
const LOCATIONS = [
  // Historical/Tourist Locations (from original artifact)
  { name: 'Red Fort', distanceFromCenter: 2, region: 'Central', longitude: 77.2373, latitude: 28.6562 },
  { name: 'Qutub Minar', distanceFromCenter: 16, region: 'South', longitude: 77.1855, latitude: 28.5245 },
  { name: 'Humayun\'s Tomb', distanceFromCenter: 8, region: 'Central', longitude: 77.2507, latitude: 28.5933 },
  { name: 'India Gate', distanceFromCenter: 7, region: 'Central', longitude: 77.2295, latitude: 28.6129 },
  { name: 'Lotus Temple', distanceFromCenter: 13, region: 'South', longitude: 77.2590, latitude: 28.5535 },
  { name: 'Jama Masjid', distanceFromCenter: 3, region: 'Central', longitude: 77.2373, latitude: 28.6507 },
  { name: 'ISKCON Temple', distanceFromCenter: 10, region: 'South', longitude: 77.2124, latitude: 28.5402 },
  { name: 'Lodhi Gardens', distanceFromCenter: 5, region: 'Central', longitude: 77.2254, latitude: 28.5931 },
  { name: 'Deer Park', distanceFromCenter: 7, region: 'Central', longitude: 77.2089, latitude: 28.5902 },
  { name: 'Rashtrapati Bhawan', distanceFromCenter: 3, region: 'Central', longitude: 77.2084, latitude: 28.6139 },
  { name: 'Akshardham Temple', distanceFromCenter: 8, region: 'East', longitude: 77.2857, latitude: 28.6180 },
  { name: 'Hauz Khas', distanceFromCenter: 10, region: 'South', longitude: 77.2038, latitude: 28.5546 },
  { name: 'Jantar Mantar', distanceFromCenter: 2, region: 'Central', longitude: 77.2166, latitude: 28.6273 },
  
  // Additional locations from the provided data
  { name: 'LNJP Hospital', distanceFromCenter: 4, region: 'Central', longitude: 77.2262, latitude: 28.6474 },
  { name: 'Jangpura', distanceFromCenter: 6, region: 'South East', longitude: 77.2628, latitude: 28.5962 },
  { name: 'Pragati Maidan', distanceFromCenter: 5, region: 'Central', longitude: 77.2490, latitude: 28.6158 },
  { name: 'ITO', distanceFromCenter: 4, region: 'Central', longitude: 77.2507, latitude: 28.6269 },
  { name: 'Majnu Ka Tila', distanceFromCenter: 7, region: 'North', longitude: 77.2216, latitude: 28.6944 },
  { name: 'Civil Lines', distanceFromCenter: 9, region: 'North', longitude: 77.2245, latitude: 28.7041 },
  { name: 'Tibetan Camp', distanceFromCenter: 8, region: 'North', longitude: 77.2216, latitude: 28.6944 }
];

// Haversine formula for calculating distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const DelhiFareCalculator: React.FC = () => {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<keyof typeof VEHICLE_RATES>('petrol');
  const [distance, setDistance] = useState<number>(0);

  // Calculate fare and distance
  const fareDetails = useMemo(() => {
    const fromPlace = LOCATIONS.find(loc => loc.name === fromLocation);
    const toPlace = LOCATIONS.find(loc => loc.name === toLocation);

    if (fromPlace && toPlace) {
      const calculatedDistance = calculateDistance(
        fromPlace.latitude, 
        fromPlace.longitude, 
        toPlace.latitude, 
        toPlace.longitude
      );
      
      const rate = VEHICLE_RATES[vehicleType].rate;
      const fare = calculatedDistance * rate;

      return {
        distance: calculatedDistance,
        fare: fare,
        fromRegion: fromPlace.region,
        toRegion: toPlace.region
      };
    }

    return { distance: 0, fare: 0, fromRegion: '', toRegion: '' };
  }, [fromLocation, toLocation, vehicleType]);

  // Emoji selection based on fare
  const getFareEmoji = () => {
    const fare = fareDetails.fare;
    if (fare < 100) return '💸';
    if (fare < 200) return '💰';
    return '🤑';
  };

  const VehicleIcon = VEHICLE_RATES[vehicleType].icon;

  return (
    <div className="max-w-md  mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Delhi Transportation Fare Calculator
      </h2>

      {/* Vehicle Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Vehicle Type
        </label>
        <div className="flex justify-between mt-2">
          {(Object.keys(VEHICLE_RATES) as Array<keyof typeof VEHICLE_RATES>).map(type => (
            <button
              key={type}
              onClick={() => setVehicleType(type)}
              className={`p-2 rounded-full ${
                vehicleType === type ? 'bg-blue-100' : 'bg-gray-100'
              } hover:bg-blue-200 transition`}
            >
              <div className="flex flex-col items-center">
                <VehicleIcon 
                  className={`w-8 h-8 ${VEHICLE_RATES[type].color}`} 
                />
                <span className="text-xs capitalize mt-1">{type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* From Location Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          From Location
        </label>
        <select
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Choose Starting Location</option>
          {LOCATIONS.map(location => (
            <option key={location.name} value={location.name}>
              {location.name} ({location.region})
            </option>
          ))}
        </select>
      </div>

      {/* To Location Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          To Location
        </label>
        <select
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Choose Destination</option>
          {LOCATIONS.map(location => (
            <option key={location.name} value={location.name}>
              {location.name} ({location.region})
            </option>
          ))}
        </select>
      </div>

      {/* Fare Calculation Result */}
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <div className="flex justify-center items-center mb-2">
          <VehicleIcon className={`w-10 h-10 mr-2 ${VEHICLE_RATES[vehicleType].color}`} />
          <h3 className="text-xl font-semibold">Estimated Journey Details</h3>
        </div>
        {fromLocation && toLocation ? (
          <div>
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <MapPin className="mr-2 text-blue-500" />
                <span>{fromLocation} ({fareDetails.fromRegion})</span>
              </div>
              <Navigation className="text-green-500" />
              <div className="flex items-center">
                <MapPin className="mr-2 text-red-500" />
                <span>{toLocation} ({fareDetails.toRegion})</span>
              </div>
            </div>
            <p className="text-xl font-bold">
              Distance: {fareDetails.distance.toFixed(2)} km
            </p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{fareDetails.fare.toFixed(2)}
            </p>
            <div className="text-4xl mt-2">{getFareEmoji()}</div>
          </div>
        ) : (
          <p className="text-gray-500">Select locations to calculate fare</p>
        )}
      </div>
    </div>
  );
};

export default DelhiFareCalculator;


{/*import { 
  useJsApiLoader, 
  GoogleMap, 
  DirectionsRenderer 
} from "@react-google-maps/api";
   <GoogleMap
          center={DELHI_CONFIG.center}
          zoom={10}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMapState(prev => ({ ...prev, map }))}
        >
          {mapState.directionsResponse && (
            <DirectionsRenderer directions={mapState.directionsResponse} />
          )}
        </GoogleMap> */}








// import React, { useRef, useState, useCallback } from "react";
// import { 
//   useJsApiLoader, 
//   GoogleMap, 
//   DirectionsRenderer 
// } from "@react-google-maps/api";

// // Define center as a const object
// const center = { lat: 28.6297, lng: 77.3721 };

// // Explicitly type the libraries array
// const libraries: ("places")[] = ["places"];

// const App: React.FC = () => {
//   // Explicitly type state variables
//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
//   const [distance, setDistance] = useState<string>("0.0 km");
//   const [duration, setDuration] = useState<string>("0 mins");

//   // Add proper ref typing
//   const originRef = useRef<HTMLInputElement>(null);
//   const destinationRef = useRef<HTMLInputElement>(null);

//   // Type the loader hook result
//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCTyo-plr3oOHxyxrumkhUzZHQeZOTyXx8',
//     libraries,
//   });

//   // Add null check to reCenter callback
//   const reCenter = useCallback(() => {
//     if (map) {
//       map.setZoom(10);
//       map.panTo(center);
//     }
//   }, [map]);

//   // Handle loading and error states
//   if (!isLoaded) {
//     return <div>🗺️ Loading...</div>;
//   }

//   if (loadError) {
//     return <div>🚫 Map cannot be loaded right now, sorry.</div>;
//   }

//   // Add proper error handling and type checking
//   const calculateRoute = async () => {
//     // Ensure refs are not null and have values
//     if (!originRef.current?.value || !destinationRef.current?.value) {
//       return;
//     }

//     const directionsService = new window.google.maps.DirectionsService();
    
//     try {
//       const results = await directionsService.route({
//         origin: originRef.current.value,
//         destination: destinationRef.current.value,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       });

//       // Safer null checks with optional chaining and nullish coalescing
//       const route = results.routes?.[0];
//       const leg = route?.legs?.[0];

//       if (leg) {
//         setDirectionsResponse(results);
        
//         // Safely access distance and duration
//         const distanceText = leg.distance?.text ?? "Unable to calculate";
//         const durationText = leg.duration?.text ?? "Unable to calculate";

//         setDistance(distanceText);
//         setDuration(durationText);
//       } else {
//         // Handle case where no valid route is found
//         setDistance("No route found");
//         setDuration("No route found");
//         setDirectionsResponse(null);
//       }
//     } catch (err) {
//       console.error(err);
//       setDistance("Unable to calculate route");
//       setDuration("Unable to calculate route");
//       setDirectionsResponse(null);
//     }
//   };

//   // Clear route with null checks
//   const clearRoute = () => {
//     setDirectionsResponse(null);
//     setDistance("0.0 km");
//     setDuration("0 mins");
    
//     // Safely clear input values
//     if (originRef.current) {
//       originRef.current.value = "";
//     }
//     if (destinationRef.current) {
//       destinationRef.current.value = "";
//     }
//   };

//   return (
//     <div 
//       style={{
//         position: "relative",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         height: "100vh",
//         width: "100vw"
//       }}
//     >
//       <div 
//         style={{
//           position: "absolute", 
//           left: 0, 
//           top: 0, 
//           height: "100%", 
//           width: "100%"
//         }}
//       >
//         <GoogleMap
//           center={center}
//           zoom={10}
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           // Properly type the map parameter
//           onLoad={(map: google.maps.Map) => setMap(map)}
//         >
//           {directionsResponse && (
//             <DirectionsRenderer directions={directionsResponse} />
//           )}
//         </GoogleMap>
//       </div>
//       <div 
//         style={{
//           zIndex: 1,
//           position: "absolute",
//           top: "20px",
//           backgroundColor: "white",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//           width: "300px"
//         }}
//       >
//         <div style={{ marginBottom: "10px" }}>
//           <input 
//             type="text" 
//             placeholder="🏁 Origin" 
//             ref={originRef}
//             style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//           />
//           <input 
//             type="text" 
//             placeholder="🏁 Destination" 
//             ref={destinationRef}
//             style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//           />
//         </div>
//         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
//           <button 
//             onClick={calculateRoute}
//             style={{ 
//               padding: "10px", 
//               backgroundColor: "#4CAF50", 
//               color: "white", 
//               border: "none", 
//               borderRadius: "4px" 
//             }}
//           >
//             🧭 Calculate Route
//           </button>
//           <button 
//             onClick={clearRoute}
//             style={{ 
//               padding: "10px", 
//               backgroundColor: "#f44336", 
//               color: "white", 
//               border: "none", 
//               borderRadius: "4px" 
//             }}
//           >
//             🗑️ Clear
//           </button>
//           <button 
//             onClick={reCenter}
//             style={{ 
//               padding: "10px", 
//               backgroundColor: "#2196F3", 
//               color: "white", 
//               border: "none", 
//               borderRadius: "4px" 
//             }}
//           >
//             🌍 Recenter
//           </button>
//         </div>
//         <div>
//           <p>📏 Distance: {distance}</p>
//           <p>⏱️ Duration: {duration}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;