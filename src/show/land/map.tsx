import React, { useState, useMemo, useEffect } from 'react';
import { Car, Truck, Zap, Leaf, MapPin, Navigation, ChevronDown, Bike, LucideBike} from 'lucide-react';
import Side from '../../components/it/Sidebar'
import { 
  useJsApiLoader, 
  GoogleMap, 
  DirectionsRenderer 
} from "@react-google-maps/api";
// Enhanced Vehicle Rates with more detailed information
const VEHICLE_RATES = {
  petrol: { 
    rate: 25, 
    icon: Car, 
    color: 'text-red-500',
    averageSpeed: 30, // km/h
    trafficMultiplier: {
      weekday: { morning: 1.5, afternoon: 1.2, evening: 1.7, night: 1 },
      weekend: { morning: 1.3, afternoon: 1.1, evening: 1.4, night: 1 }
    }
  },
  diesel: { 
    rate: 10, 
    icon: Truck, 
    color: 'text-gray-700',
    averageSpeed: 25, 
    trafficMultiplier: {
      weekday: { morning: 1.6, afternoon: 1.3, evening: 1.8, night: 1 },
      weekend: { morning: 1.4, afternoon: 1.2, evening: 1.5, night: 1 }
    }
  },
  electric: { 
    rate: 9, 
    icon: Zap, 
    color: 'text-yellow-500',
    averageSpeed: 35, 
    trafficMultiplier: {
      weekday: { morning: 1.4, afternoon: 1.1, evening: 1.5, night: 1 },
      weekend: { morning: 1.2, afternoon: 1, evening: 1.3, night: 1 }
    }
  },
  cng: { 
    rate: 8, 
    icon: Leaf, 
    color: 'text-green-500',
    averageSpeed: 28, 
    trafficMultiplier: {
      weekday: { morning: 1.5, afternoon: 1.2, evening: 1.6, night: 1 },
      weekend: { morning: 1.3, afternoon: 1.1, evening: 1.4, night: 1 }
    }
  },
  twoWheelerPetrol: {
    rate: 15,
    icon: LucideBike,
    color: 'text-blue-500',
    averageSpeed: 40,
    trafficMultiplier: {
      weekday: { morning: 1.2, afternoon: 1.1, evening: 1.4, night: 1 },
      weekend: { morning: 1.1, afternoon: 1, evening: 1.2, night: 1 }
    }
  },
  twoWheelerElectric: {
    rate: 7,
    icon: Bike,
    color: 'text-purple-500',
    averageSpeed: 35,
    trafficMultiplier: {
      weekday: { morning: 1.3, afternoon: 1.1, evening: 1.5, night: 1 },
      weekend: { morning: 1.2, afternoon: 1, evening: 1.3, night: 1 }
    }
  },
  threeWheeler: {
    rate: 12,
    icon: Car,
    color: 'text-orange-500',
    averageSpeed: 25,
    trafficMultiplier: {
      weekday: { morning: 1.6, afternoon: 1.3, evening: 1.7, night: 1 },
      weekend: { morning: 1.4, afternoon: 1.2, evening: 1.5, night: 1 }
    }
  }
};

// Location data remains the same as in the original code
const LOCATIONS = [
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

// Haversine formula for distance calculation
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
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Determine time of day and day type
  const getTimeCategory = () => {
    const hour = currentTime.getHours();
    const day = currentTime.getDay();
    const isWeekend = day === 0 || day === 6;
    
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  };

  // Calculate fare and estimated time
  const travelDetails = useMemo(() => {
    const fromPlace = LOCATIONS.find(loc => loc.name === fromLocation);
    const toPlace = LOCATIONS.find(loc => loc.name === toLocation);

    if (fromPlace && toPlace) {
      // Calculate distance
      const calculatedDistance = calculateDistance(
        fromPlace.latitude, 
        fromPlace.longitude, 
        toPlace.latitude, 
        toPlace.longitude
      );
      
      // Get vehicle details
      const vehicleDetails = VEHICLE_RATES[vehicleType];
      const rate = vehicleDetails.rate;
      
      // Calculate fare
      const baseFare = calculatedDistance * rate;

      // Calculate time with traffic consideration
      const timeCategory = getTimeCategory();
      const dayType = currentTime.getDay() === 0 || currentTime.getDay() === 6 ? 'weekend' : 'weekday';
      const trafficMultiplier = vehicleDetails.trafficMultiplier[dayType][timeCategory];
      
      // Calculate estimated travel time
      const estimatedTime = (calculatedDistance / vehicleDetails.averageSpeed) * trafficMultiplier;

      return {
        distance: calculatedDistance,
        fare: baseFare,
        estimatedTime: estimatedTime,
        fromRegion: fromPlace.region,
        toRegion: toPlace.region,
        trafficMultiplier: trafficMultiplier,
        timeCategory: timeCategory
      };
    }

    return { 
      distance: 0, 
      fare: 0, 
      estimatedTime: 0, 
      fromRegion: '', 
      toRegion: '',
      trafficMultiplier: 1,
      timeCategory: 'night'
    };
  }, [fromLocation, toLocation, vehicleType, currentTime]);

  // Emoji selection based on fare and traffic
  const getFareEmoji = () => {
    const fare = travelDetails.fare;
    const trafficMultiplier = travelDetails.trafficMultiplier;
    
    if (fare < 100 && trafficMultiplier < 1.3) return '🚀';
    if (fare < 200 && trafficMultiplier < 1.5) return '💸';
    if (trafficMultiplier > 1.6) return '🐌';
    return '🚦';
  };

  // Update current time periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleLoaded(true);
      document.body.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMaps();
    } else {
      setGoogleLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (googleLoaded) {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 28.6139, lng: 77.209 }, // Coordinates for Delhi
        zoom: 12, // Adjust zoom level for Delhi
      });
    }
  }, [googleLoaded]);

  if (!googleLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Loading Google Maps...</p>
      </div>
    );
  }
  // Render the component
  return (
    <>
      <Side />
      <div id="map" className="h-[50vh] border rounded-lg shadow-md"></div>
      
      <div className="flex-grow flex z-[50] items-center justify-center p-4"><div
          
          className="absolute top-0 left-0 z-[50] flex p-6 rounded-lg shadow-lg"
        >
          <img
            src="/logo.png"
            className="h-10 w-10"
            alt="Logo"
          />
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-900
                       bg-clip-text text-transparent"
          >
            Reboostify
          </h1>
        </div>
        <div className="  bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-green-600 text-white p-4 text-center">
            <h2 className="text-2xl font-bold">Travel Cost Calculator</h2>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {/* Vehicle Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Vehicle Type</h3>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(VEHICLE_RATES) as (keyof typeof VEHICLE_RATES)[]).map(type => {
                  const VehicleIcon = VEHICLE_RATES[type].icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setVehicleType(type)}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        vehicleType === type 
                          ? 'bg-yellow-100 border-2 border-yellow-500' 
                          : 'bg-gray-100 hover:bg-yellow-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <VehicleIcon 
                          className={`w-8 h-8 ${VEHICLE_RATES[type].color}`} 
                        />
                        <span className="text-xs uppercase mt-2">
                          {type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location Selections */}
            <div className="space-y-4">
              {/* From Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location
                </label>
                <div className="relative">
                  <select
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Choose Starting Location</option>
                    {LOCATIONS.map(location => (
                      <option key={location.name} value={location.name}>
                        {location.name} ({location.region})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Location
                </label>
                <div className="relative">
                  <select
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Choose Destination</option>
                    {LOCATIONS.map(location => (
                      <option key={location.name} value={location.name}>
                        {location.name} ({location.region})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Fare Calculation Result */}
            {fromLocation && toLocation && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-yellow-500" />
                    <span className="font-medium">{fromLocation}</span>
                  </div>
                  <Navigation className="text-green-500" />
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-red-500" />
                    <span className="font-medium">{toLocation}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Distance: <span className="font-bold text-yellow-700">{travelDetails.distance.toFixed(2)} km</span>
                  </p>
                  <p className="text-3xl font-bold text-yellow-800">
                    ₹{travelDetails.fare.toFixed(2)}
                  </p>
                  <div className="text-4xl">{getFareEmoji()}</div>
                  
                  {/* Traffic and Time Information */}
                  <div className="mt-4 bg-yellow-100 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      Estimated Travel Time: 
                      <span className="font-bold ml-2">
                        {travelDetails.estimatedTime.toFixed(1)} hours
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Time of Day: {travelDetails.timeCategory.charAt(0).toUpperCase() + travelDetails.timeCategory.slice(1)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Traffic Multiplier: {travelDetails.trafficMultiplier.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DelhiFareCalculator;

// import React, { useState, useMemo } from 'react';
// import  { useEffect } from 'react';
// import { Car, Truck, Zap, Leaf, MapPin, Navigation,ChevronDown } from 'lucide-react';
// import Side from '../components/overlays/Sidebar'
// import { 
//   useJsApiLoader, 
//   GoogleMap, 
//   DirectionsRenderer 
// } from "@react-google-maps/api";
// // Define fare rates per km
// const VEHICLE_RATES = {
//   petrol: { rate: 25, icon: Car, color: 'text-red-500' },
//   diesel: { rate: 10, icon: Truck, color: 'text-gray-700' },
//   electric: { rate: 9, icon: Zap, color: 'text-yellow-500' },
//   cng: { rate: 8, icon: Leaf, color: 'text-green-500' }
// };
// type VehicleType = 'petrol' | 'diesel' | 'electric' | 'cng';
// // Location data with enhanced geographical context
// const LOCATIONS = [
//   // Historical/Tourist Locations (from original artifact)
//   { name: 'Red Fort', distanceFromCenter: 2, region: 'Central', longitude: 77.2373, latitude: 28.6562 },
//   { name: 'Qutub Minar', distanceFromCenter: 16, region: 'South', longitude: 77.1855, latitude: 28.5245 },
//   { name: 'Humayun\'s Tomb', distanceFromCenter: 8, region: 'Central', longitude: 77.2507, latitude: 28.5933 },
//   { name: 'India Gate', distanceFromCenter: 7, region: 'Central', longitude: 77.2295, latitude: 28.6129 },
//   { name: 'Lotus Temple', distanceFromCenter: 13, region: 'South', longitude: 77.2590, latitude: 28.5535 },
//   { name: 'Jama Masjid', distanceFromCenter: 3, region: 'Central', longitude: 77.2373, latitude: 28.6507 },
//   { name: 'ISKCON Temple', distanceFromCenter: 10, region: 'South', longitude: 77.2124, latitude: 28.5402 },
//   { name: 'Lodhi Gardens', distanceFromCenter: 5, region: 'Central', longitude: 77.2254, latitude: 28.5931 },
//   { name: 'Deer Park', distanceFromCenter: 7, region: 'Central', longitude: 77.2089, latitude: 28.5902 },
//   { name: 'Rashtrapati Bhawan', distanceFromCenter: 3, region: 'Central', longitude: 77.2084, latitude: 28.6139 },
//   { name: 'Akshardham Temple', distanceFromCenter: 8, region: 'East', longitude: 77.2857, latitude: 28.6180 },
//   { name: 'Hauz Khas', distanceFromCenter: 10, region: 'South', longitude: 77.2038, latitude: 28.5546 },
//   { name: 'Jantar Mantar', distanceFromCenter: 2, region: 'Central', longitude: 77.2166, latitude: 28.6273 },
  
//   // Additional locations from the provided data
//   { name: 'LNJP Hospital', distanceFromCenter: 4, region: 'Central', longitude: 77.2262, latitude: 28.6474 },
//   { name: 'Jangpura', distanceFromCenter: 6, region: 'South East', longitude: 77.2628, latitude: 28.5962 },
//   { name: 'Pragati Maidan', distanceFromCenter: 5, region: 'Central', longitude: 77.2490, latitude: 28.6158 },
//   { name: 'ITO', distanceFromCenter: 4, region: 'Central', longitude: 77.2507, latitude: 28.6269 },
//   { name: 'Majnu Ka Tila', distanceFromCenter: 7, region: 'North', longitude: 77.2216, latitude: 28.6944 },
//   { name: 'Civil Lines', distanceFromCenter: 9, region: 'North', longitude: 77.2245, latitude: 28.7041 },
//   { name: 'Tibetan Camp', distanceFromCenter: 8, region: 'North', longitude: 77.2216, latitude: 28.6944 }
// ];

// // Haversine formula for calculating distance between two points
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c;
// };

// const DelhiFareCalculator: React.FC = () => {
//   const [fromLocation, setFromLocation] = useState<string>('');
//   const [toLocation, setToLocation] = useState<string>('');
//   const [vehicleType, setVehicleType] = useState<keyof typeof VEHICLE_RATES>('petrol');
//   const [distance, setDistance] = useState<number>(0);

//   // Calculate fare and distance
//   const fareDetails = useMemo(() => {
//     const fromPlace = LOCATIONS.find(loc => loc.name === fromLocation);
//     const toPlace = LOCATIONS.find(loc => loc.name === toLocation);

//     if (fromPlace && toPlace) {
//       const calculatedDistance = calculateDistance(
//         fromPlace.latitude, 
//         fromPlace.longitude, 
//         toPlace.latitude, 
//         toPlace.longitude
//       );
      
//       const rate = VEHICLE_RATES[vehicleType].rate;
//       const fare = calculatedDistance * rate;

//       return {
//         distance: calculatedDistance,
//         fare: fare,
//         fromRegion: fromPlace.region,
//         toRegion: toPlace.region
//       };
//     }

//     return { distance: 0, fare: 0, fromRegion: '', toRegion: '' };
//   }, [fromLocation, toLocation, vehicleType]);

//   // Emoji selection based on fare
//   const getFareEmoji = () => {
//     const fare = fareDetails.fare;
//     if (fare < 100) return '💸';
//     if (fare < 200) return '💰';
//     return '🤑';
//   };

//   const VehicleIcon = VEHICLE_RATES[vehicleType].icon;
//   const [googleLoaded, setGoogleLoaded] = useState(false);

//   useEffect(() => {
//     const loadGoogleMaps = () => {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => setGoogleLoaded(true);
//       document.body.appendChild(script);
//     };

//     if (!window.google) {
//       loadGoogleMaps();
//     } else {
//       setGoogleLoaded(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (googleLoaded) {
//       const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
//         center: { lat: 28.6139, lng: 77.209 }, // Coordinates for Delhi
//         zoom: 12, // Adjust zoom level for Delhi
//       });
//     }
//   }, [googleLoaded]);

//   if (!googleLoaded) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-lg text-gray-500">Loading Google Maps...</p>
//       </div>
//     );
//   }
   
//   return (<><Side />
//   {/* <div className='' */}
//    <div id="map" className="h-[50vh] border rounded-lg shadow-md"></div>




//    <div className="flex-grow flex z-[50] items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
//           <div className="bg-yellow-600 text-white p-4 text-center">
//             <h2 className="text-2xl font-bold">Delhi Transportation Fare Calculator</h2>
//           </div>

//           {/* Scrollable Content */}
//           <div className="p-4 max-h-[70vh] overflow-y-auto">
//             {/* Vehicle Type Selection */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Vehicle Type</h3>
//               <div className="flex justify-between space-x-2">
//                 {(Object.keys(VEHICLE_RATES) as VehicleType[]).map(type => {
//                   const VehicleIcon = VEHICLE_RATES[type].icon;
//                   return (
//                     <button
//                       key={type}
//                       onClick={() => setVehicleType(type)}
//                       className={`flex-1 p-3 rounded-lg transition-all duration-200 ${
//                         vehicleType === type 
//                           ? 'bg-yellow-100 border-2 border-yellow-500' 
//                           : 'bg-gray-100 hover:bg-yellow-50'
//                       }`}
//                     >
//                       <div className="flex flex-col items-center">
//                         <VehicleIcon 
//                           className={`w-8 h-8 ${VEHICLE_RATES[type].color}`} 
//                         />
//                         <span className="text-xs uppercase mt-2">{type}</span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Location Selections */}
//             <div className="space-y-4">
//               {/* From Location */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   From Location
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={fromLocation}
//                     onChange={(e) => setFromLocation(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   >
//                     <option value="">Choose Starting Location</option>
//                     {LOCATIONS.map(location => (
//                       <option key={location.name} value={location.name}>
//                         {location.name} ({location.region})
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>
//               </div>

//               {/* To Location */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   To Location
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={toLocation}
//                     onChange={(e) => setToLocation(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   >
//                     <option value="">Choose Destination</option>
//                     {LOCATIONS.map(location => (
//                       <option key={location.name} value={location.name}>
//                         {location.name} ({location.region})
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Fare Calculation Result */}
//             {fromLocation && toLocation && (
//               <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex items-center">
//                     <MapPin className="mr-2 text-yellow-500" />
//                     <span className="font-medium">{fromLocation}</span>
//                   </div>
//                   <Navigation className="text-green-500" />
//                   <div className="flex items-center">
//                     <MapPin className="mr-2 text-red-500" />
//                     <span className="font-medium">{toLocation}</span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <p className="text-sm text-gray-600">
//                     Distance: <span className="font-bold text-yellow-700">{fareDetails.distance.toFixed(2)} km</span>
//                   </p>
//                   <p className="text-3xl font-bold text-yellow-800">
//                     ₹{fareDetails.fare.toFixed(2)}
//                   </p>
//                   <div className="text-4xl">{getFareEmoji()}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div></>
//   );
// };

// export default DelhiFareCalculator;


// {/*import { 
//   useJsApiLoader, 
//   GoogleMap, 
//   DirectionsRenderer 
// } from "@react-google-maps/api";
//    <GoogleMap
//           center={DELHI_CONFIG.center}
//           zoom={10}
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           onLoad={(map) => setMapState(prev => ({ ...prev, map }))}
//         >
//           {mapState.directionsResponse && (
//             <DirectionsRenderer directions={mapState.directionsResponse} />
//           )}
//         </GoogleMap> */}








// // import React, { useRef, useState, useCallback } from "react";
// // import { 
// //   useJsApiLoader, 
// //   GoogleMap, 
// //   DirectionsRenderer 
// // } from "@react-google-maps/api";

// // // Define center as a const object
// // const center = { lat: 28.6297, lng: 77.3721 };

// // // Explicitly type the libraries array
// // const libraries: ("places")[] = ["places"];

// // const App: React.FC = () => {
// //   // Explicitly type state variables
// //   const [map, setMap] = useState<google.maps.Map | null>(null);
// //   const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
// //   const [distance, setDistance] = useState<string>("0.0 km");
// //   const [duration, setDuration] = useState<string>("0 mins");

// //   // Add proper ref typing
// //   const originRef = useRef<HTMLInputElement>(null);
// //   const destinationRef = useRef<HTMLInputElement>(null);

// //   // Type the loader hook result
// //   const { isLoaded, loadError } = useJsApiLoader({
// //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCTyo-plr3oOHxyxrumkhUzZHQeZOTyXx8',
// //     libraries,
// //   });

// //   // Add null check to reCenter callback
// //   const reCenter = useCallback(() => {
// //     if (map) {
// //       map.setZoom(10);
// //       map.panTo(center);
// //     }
// //   }, [map]);

// //   // Handle loading and error states
// //   if (!isLoaded) {
// //     return <div>🗺️ Loading...</div>;
// //   }

// //   if (loadError) {
// //     return <div>🚫 Map cannot be loaded right now, sorry.</div>;
// //   }

// //   // Add proper error handling and type checking
// //   const calculateRoute = async () => {
// //     // Ensure refs are not null and have values
// //     if (!originRef.current?.value || !destinationRef.current?.value) {
// //       return;
// //     }

// //     const directionsService = new window.google.maps.DirectionsService();
    
// //     try {
// //       const results = await directionsService.route({
// //         origin: originRef.current.value,
// //         destination: destinationRef.current.value,
// //         travelMode: window.google.maps.TravelMode.DRIVING,
// //       });

// //       // Safer null checks with optional chaining and nullish coalescing
// //       const route = results.routes?.[0];
// //       const leg = route?.legs?.[0];

// //       if (leg) {
// //         setDirectionsResponse(results);
        
// //         // Safely access distance and duration
// //         const distanceText = leg.distance?.text ?? "Unable to calculate";
// //         const durationText = leg.duration?.text ?? "Unable to calculate";

// //         setDistance(distanceText);
// //         setDuration(durationText);
// //       } else {
// //         // Handle case where no valid route is found
// //         setDistance("No route found");
// //         setDuration("No route found");
// //         setDirectionsResponse(null);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setDistance("Unable to calculate route");
// //       setDuration("Unable to calculate route");
// //       setDirectionsResponse(null);
// //     }
// //   };

// //   // Clear route with null checks
// //   const clearRoute = () => {
// //     setDirectionsResponse(null);
// //     setDistance("0.0 km");
// //     setDuration("0 mins");
    
// //     // Safely clear input values
// //     if (originRef.current) {
// //       originRef.current.value = "";
// //     }
// //     if (destinationRef.current) {
// //       destinationRef.current.value = "";
// //     }
// //   };

// //   return (
// //     <div 
// //       style={{
// //         position: "relative",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         height: "100vh",
// //         width: "100vw"
// //       }}
// //     >
// //       <div 
// //         style={{
// //           position: "absolute", 
// //           left: 0, 
// //           top: 0, 
// //           height: "100%", 
// //           width: "100%"
// //         }}
// //       >
// //         <GoogleMap
// //           center={center}
// //           zoom={10}
// //           mapContainerStyle={{ width: "100%", height: "100%" }}
// //           options={{
// //             zoomControl: false,
// //             streetViewControl: false,
// //             mapTypeControl: false,
// //             fullscreenControl: false,
// //           }}
// //           // Properly type the map parameter
// //           onLoad={(map: google.maps.Map) => setMap(map)}
// //         >
// //           {directionsResponse && (
// //             <DirectionsRenderer directions={directionsResponse} />
// //           )}
// //         </GoogleMap>
// //       </div>
// //       <div 
// //         style={{
// //           zIndex: 1,
// //           position: "absolute",
// //           top: "20px",
// //           backgroundColor: "white",
// //           padding: "20px",
// //           borderRadius: "8px",
// //           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
// //           width: "300px"
// //         }}
// //       >
// //         <div style={{ marginBottom: "10px" }}>
// //           <input 
// //             type="text" 
// //             placeholder="🏁 Origin" 
// //             ref={originRef}
// //             style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
// //           />
// //           <input 
// //             type="text" 
// //             placeholder="🏁 Destination" 
// //             ref={destinationRef}
// //             style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
// //           />
// //         </div>
// //         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
// //           <button 
// //             onClick={calculateRoute}
// //             style={{ 
// //               padding: "10px", 
// //               backgroundColor: "#4CAF50", 
// //               color: "white", 
// //               border: "none", 
// //               borderRadius: "4px" 
// //             }}
// //           >
// //             🧭 Calculate Route
// //           </button>
// //           <button 
// //             onClick={clearRoute}
// //             style={{ 
// //               padding: "10px", 
// //               backgroundColor: "#f44336", 
// //               color: "white", 
// //               border: "none", 
// //               borderRadius: "4px" 
// //             }}
// //           >
// //             🗑️ Clear
// //           </button>
// //           <button 
// //             onClick={reCenter}
// //             style={{ 
// //               padding: "10px", 
// //               backgroundColor: "#2196F3", 
// //               color: "white", 
// //               border: "none", 
// //               borderRadius: "4px" 
// //             }}
// //           >
// //             🌍 Recenter
// //           </button>
// //         </div>
// //         <div>
// //           <p>📏 Distance: {distance}</p>
// //           <p>⏱️ Duration: {duration}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;