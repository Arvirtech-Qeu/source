/// <reference types="@types/google.maps" />
import React, { useRef, useEffect, useState } from 'react';
import { Search, MapPin, Navigation, Clock, CheckCircle, X, Star, Plus } from 'lucide-react';

// Enhanced type for selected place with detailed address components
type SelectedPlace = {
    fullAddress: string | undefined;
    line1: string | undefined;
    location: google.maps.LatLng | google.maps.LatLngLiteral;
    addressComponents?: {
        [key: string]: string;
    };
} | null;

// Type for search suggestions
type SearchSuggestion = {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
};

// Type for pinned locations
type PinnedLocation = {
    id: string;
    name: string;
    address: string;
    location: google.maps.LatLng | google.maps.LatLngLiteral;
    isPinned: boolean;
    timestamp: number;
};

// Interface for component props
interface GoogleMapComponentProps {
    onAddressSelect: (place: any) => void;
    setIsMapOpen: (isOpen: boolean) => void;
    setIsModelOpen?: (isOpen: boolean) => void; // Optional setter function
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
    onAddressSelect,
    setIsMapOpen,
    setIsModelOpen
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedPlace, setSelectedPlace] = useState<SelectedPlace>(null);
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [pinnedLocations, setPinnedLocations] = useState<PinnedLocation[]>([]);
    const [showPinnedList, setShowPinnedList] = useState(false);

    // Reference to store active markers
    const markersRef = useRef<google.maps.Marker[]>([]);
    // Reference to store pinned markers
    const pinnedMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());
    // Reference to store the map instance
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    // Reference to store the autocomplete service
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    // Reference to store the places service
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    // Helper function to clear all existing markers (except pinned ones)
    const clearMarkers = () => {
        if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        }
    };

    // Helper function to add a marker with custom styling
    const addMarker = (
        position: google.maps.LatLng | google.maps.LatLngLiteral,
        title: string = "Selected Location",
        isCurrentLocation: boolean = false,
        isPinned: boolean = false,
        id?: string
    ) => {
        if (!mapInstanceRef.current) return null;

        const marker = new google.maps.Marker({
            map: mapInstanceRef.current,
            position,
            title,
            animation: google.maps.Animation.DROP,
            icon: isCurrentLocation ? {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            } : isPinned ? {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#FFD700',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                rotation: 180
            } : {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: '#EA4335',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                rotation: 180
            }
        });

        if (isPinned && id) {
            pinnedMarkersRef.current.set(id, marker);
        } else {
            markersRef.current.push(marker);
        }

        return marker;
    };

    // Helper function to extract address components from Google Places result
    const extractAddressComponents = (place: google.maps.places.PlaceResult) => {
        const components: { [key: string]: string } = {};
        let line1 = '';

        if (place.address_components) {
            place.address_components.forEach(component => {
                const types = component.types;

                if (types.includes('street_number')) {
                    components.streetNumber = component.long_name;
                }
                if (types.includes('route')) {
                    components.route = component.long_name;
                }
                if (types.includes('sublocality_level_1')) {
                    components.locality = component.long_name;
                }
                if (types.includes('administrative_area_level_3')) {
                    components.locality = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    components.state = component.long_name;
                }
                if (types.includes('country')) {
                    components.country = component.long_name;
                }
                if (types.includes('postal_code')) {
                    components.postalCode = component.long_name;
                }
            });

            if (components.streetNumber && components.route) {
                line1 = `${components.streetNumber} ${components.route}`;
            } else if (components.route) {
                line1 = components.route;
            }
        }

        return { components, line1 };
    };

    // Function to fetch search suggestions
    const fetchSearchSuggestions = (input: string) => {
        if (!input.trim() || !autocompleteService.current) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const request = {
            input: input,
            componentRestrictions: { country: 'IN' }, // You can adjust this based on your needs
        };

        autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                setSearchSuggestions(predictions.slice(0, 5));
                setShowSuggestions(true);
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
        });
    };

    // Function to handle search input change
    const handleSearchInputChange = (value: string) => {
        setSearchValue(value);
        if (value.length > 2) {
            fetchSearchSuggestions(value);
        } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Function to handle suggestion selection
    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
        setSearchValue(suggestion.description);
        setShowSuggestions(false);

        // Get place details and handle search
        if (placesService.current) {
            const request = {
                placeId: suggestion.place_id,
                fields: ['name', 'geometry', 'formatted_address', 'address_components'],
            };

            placesService.current.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    handlePlaceSelection(place);
                }
            });
        }
    };

    // Function to handle place selection (common for search and suggestions)
    const handlePlaceSelection = (place: google.maps.places.PlaceResult) => {
        if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
        }

        // Clear existing markers
        clearMarkers();

        // Add marker for the searched location
        addMarker(place.geometry.location, place.name || "Selected Location");

        // Center map on the location
        mapInstanceRef.current?.setCenter(place.geometry.location);
        mapInstanceRef.current?.setZoom(16);

        // Extract address components
        const { components, line1 } = extractAddressComponents(place);

        // Update selected place
        setSelectedPlace({
            fullAddress: place.formatted_address,
            line1,
            location: place.geometry.location.toJSON(),
            addressComponents: components
        });

        // Call callback
        if (onAddressSelect) {
            const location = place.geometry.location.toJSON();
            onAddressSelect({
                ...place,
                addressDetails: {
                    addressSno: 0,
                    line1: line1 || place.formatted_address?.split(',')[0] || '',
                    line2: '',
                    geoLocCode: `${location.lat},${location.lng}`,
                    description: place.formatted_address || '',
                    activeFlag: true
                }
            });
        }
    };

    // Function to handle search
    const handleSearch = () => {
        if (!searchValue.trim() || !placesService.current) return;

        setIsLoading(true);
        setShowSuggestions(false);

        // Add to recent searches
        setRecentSearches(prev => {
            const updated = [searchValue, ...prev.filter(item => item !== searchValue)].slice(0, 5);
            return updated;
        });

        // Trigger places search
        const request = {
            query: searchValue,
            fields: ['name', 'geometry', 'formatted_address', 'address_components'],
        };

        placesService.current.textSearch(request, (results, status) => {
            setIsLoading(false);

            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                handlePlaceSelection(results[0]);
            }
        });
    };

    // Function to pin current location
    const pinCurrentLocation = () => {
        if (!selectedPlace) return;

        const id = Date.now().toString();
        const pinnedLocation: PinnedLocation = {
            id,
            name: selectedPlace.line1 || 'Pinned Location',
            address: selectedPlace.fullAddress || '',
            location: selectedPlace.location,
            isPinned: true,
            timestamp: Date.now()
        };

        setPinnedLocations(prev => [...prev, pinnedLocation]);

        // Add pinned marker
        addMarker(selectedPlace.location, pinnedLocation.name, false, true, id);
    };

    // Function to remove pinned location
    const removePinnedLocation = (id: string) => {
        setPinnedLocations(prev => prev.filter(loc => loc.id !== id));

        // Remove marker
        const marker = pinnedMarkersRef.current.get(id);
        if (marker) {
            marker.setMap(null);
            pinnedMarkersRef.current.delete(id);
        }
    };

    // Function to navigate to pinned location
    const navigateToPinnedLocation = (location: PinnedLocation) => {
        mapInstanceRef.current?.setCenter(location.location);
        mapInstanceRef.current?.setZoom(16);

        // Clear current markers and add new one
        clearMarkers();
        addMarker(location.location, location.name);

        setSelectedPlace({
            fullAddress: location.address,
            line1: location.name,
            location: location.location,
            addressComponents: {}
        });
    };

    // Function to use current location
    const useAddAddress = () => {
        // Handle modal opening
        if (setIsModelOpen) {
            // If the setter function is provided, use it directly
            setIsModelOpen(true);
            setIsMapOpen(false);
        } else if (onAddressSelect) {
            // Otherwise, use the callback to notify the parent component
            onAddressSelect({
                modalShouldBeOpen: true,
                // Include any other data needed for the address
                addressDetails: {
                    addressSno: 0,
                    line1: '',
                    line2: '',
                    geoLocCode: '',
                    description: '',
                    activeFlag: true
                }
            });
        }
    };

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            return;
        }

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on current location
                mapInstanceRef.current?.setCenter(currentLocation);
                mapInstanceRef.current?.setZoom(16);

                // Clear existing markers and add current location marker
                clearMarkers();
                addMarker(currentLocation, "Your Current Location", true);

                // Geocode current location
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: currentLocation }, (results, status) => {
                    setIsLoading(false);

                    if (status === "OK" && results && results[0]) {
                        const place = results[0];
                        const { components, line1 } = extractAddressComponents(place);

                        setSelectedPlace({
                            fullAddress: place.formatted_address,
                            line1,
                            location: currentLocation,
                            addressComponents: components
                        });

                        if (onAddressSelect) {
                            onAddressSelect({
                                ...place,
                                addressDetails: {
                                    addressSno: 0,
                                    line1: line1 || place.formatted_address?.split(',')[0] || '',
                                    line2: '',
                                    geoLocCode: `${currentLocation.lat},${currentLocation.lng}`,
                                    description: place.formatted_address || '',
                                    activeFlag: true
                                }
                            });
                        }
                    }
                });
            },
            (error) => {
                setIsLoading(false);
                console.error("Error getting location:", error);
            }
        );
    };

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize the map with elegant styling
        const map = new google.maps.Map(mapRef.current, {
            center: { lat: 12.9716, lng: 77.5946 }, // Bangalore as default
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                },
                {
                    featureType: 'transit',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        mapInstanceRef.current = map;

        // Initialize services
        autocompleteService.current = new google.maps.places.AutocompleteService();
        placesService.current = new google.maps.places.PlacesService(map);

        // Automatically get user's current location on load
        useCurrentLocation();

        // Clean up function
        return () => {
            clearMarkers();
            pinnedMarkersRef.current.forEach(marker => marker.setMap(null));
            pinnedMarkersRef.current.clear();
        };
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-color px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-white text-xl font-semibold flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Location Picker
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Search for a location or use your current position</p>
                    </div>
                    <button type="button"
                        onClick={() => setShowPinnedList(!showPinnedList)}
                        className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                    >
                        <Star className="w-4 h-4" />
                        Pinned ({pinnedLocations.length})
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="p-6 border-b border-gray-100">
                <div className="relative mb-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                onFocus={() => searchValue.length > 2 && setShowSuggestions(true)}
                                placeholder="Search for a location..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <button type="button"
                            onClick={handleSearch}
                            disabled={isLoading || !searchValue.trim()}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Search Suggestions */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-12 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                            {searchSuggestions.map((suggestion, index) => (
                                <button type="button"
                                    key={index}
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="text-sm font-medium text-gray-900">
                                        {suggestion.structured_formatting.main_text}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {suggestion.structured_formatting.secondary_text}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <button type="button"
                        onClick={useAddAddress}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </button>

                    {selectedPlace && (
                        <button type="button"
                            onClick={pinCurrentLocation}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            <Star className="w-4 h-4" />
                            Pin This Location
                        </button>
                    )}

                    {recentSearches.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Recent:</span>
                            <div className="flex gap-1">
                                {recentSearches.slice(0, 3).map((search, index) => (
                                    <button type="button"
                                        key={index}
                                        onClick={() => {
                                            setSearchValue(search);
                                            setTimeout(handleSearch, 100);
                                        }}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                                    >
                                        {search.length > 20 ? `${search.substring(0, 20)}...` : search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pinned Locations List */}
            {showPinnedList && pinnedLocations.length > 0 && (
                <div className="p-6 bg-yellow-50 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Pinned Locations</h3>
                    <div className="space-y-2">
                        {pinnedLocations.map((location) => (
                            <div key={location.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900">{location.name}</div>
                                    <div className="text-sm text-gray-500">{location.address}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button"
                                        onClick={() => navigateToPinnedLocation(location)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Go
                                    </button>
                                    <button type="button"
                                        onClick={() => removePinnedLocation(location.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="relative">
                <div ref={mapRef} className="h-96 w-full" />
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Location Details */}
            {selectedPlace && (
                <div className="p-6 bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Selected Location</h3>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <p className="text-gray-900 bg-gray-50 p-2 rounded border text-sm">
                                        {selectedPlace.fullAddress}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                    <p className="text-gray-900 bg-gray-50 p-2 rounded border text-sm">
                                        {selectedPlace.line1 || selectedPlace.fullAddress?.split(',')[0] || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                                    <p className="text-gray-900 bg-gray-50 p-2 rounded border text-sm font-mono">
                                        {`${typeof selectedPlace.location.lat === 'function'
                                            ? selectedPlace.location.lat().toFixed(6)
                                            : selectedPlace.location.lat.toFixed(6)}, ${typeof selectedPlace.location.lng === 'function'
                                                ? selectedPlace.location.lng().toFixed(6)
                                                : selectedPlace.location.lng.toFixed(6)}`}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-green-600 font-medium">Location Selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoogleMapComponent;