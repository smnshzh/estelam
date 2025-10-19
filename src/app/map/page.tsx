"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Link from "next/link";

interface Seller {
  id: string;
  business_name: string;
  business_type: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
}

export default function MapPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }

    // Fetch sellers (in a real app, this would be an API call)
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      // This would be replaced with actual API call
      const mockSellers: Seller[] = [
        {
          id: "1",
          business_name: "فروشگاه مواد غذایی",
          business_type: "غذایی",
          address: "تهران، خیابان ولیعصر",
          latitude: 35.7219,
          longitude: 51.4076,
          status: "approved"
        },
        {
          id: "2",
          business_name: "کافه کتاب",
          business_type: "کافه",
          address: "تهران، پارک وی",
          latitude: 35.7448,
          longitude: 51.4145,
          status: "approved"
        }
      ];
      
      setSellers(mockSellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const markers = sellers.map(seller => ({
    id: seller.id,
    lat: seller.latitude,
    lng: seller.longitude,
    title: seller.business_name,
    description: `${seller.business_type} - ${seller.address}`,
    onClick: () => {
      // Handle marker click
      console.log("Clicked on seller:", seller.id);
    }
  }));

  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lng, userLocation.lat]
    : [51.3890, 35.6892]; // Tehran default

  return (
    <SessionAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">نقشه فروشندگان</h1>
              </div>
              <nav className="flex space-x-8 space-x-reverse">
                <Link 
                  href="/dashboard" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  دشبورد
                </Link>
                <Link 
                  href="/sellers" 
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  فروشندگان
                </Link>
                <Link 
                  href="/map" 
                  className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  نقشه
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  موقعیت فروشندگان
                </h2>
                <p className="text-sm text-gray-600">
                  روی نقشه کلیک کنید تا موقعیت جدید انتخاب کنید یا روی مارکرها کلیک کنید تا اطلاعات فروشنده را ببینید.
                </p>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-gray-500">در حال بارگذاری...</div>
                </div>
              ) : (
                <div className="h-96">
                  <Map
                    center={mapCenter}
                    zoom={12}
                    onLocationSelect={handleLocationSelect}
                    markers={markers}
                  />
                </div>
              )}

              {selectedLocation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900">موقعیت انتخاب شده:</h3>
                  <p className="text-sm text-blue-700">
                    عرض جغرافیایی: {selectedLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-blue-700">
                    طول جغرافیایی: {selectedLocation.lng.toFixed(6)}
                  </p>
                  <button
                    onClick={() => {
                      // Handle adding new seller at this location
                      console.log("Add seller at:", selectedLocation);
                    }}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    ثبت فروشنده در این موقعیت
                  </button>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">فروشندگان نزدیک</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{seller.business_name}</h4>
                      <p className="text-sm text-gray-600">{seller.business_type}</p>
                      <p className="text-sm text-gray-500">{seller.address}</p>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          seller.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {seller.status === 'approved' ? 'تایید شده' : 'در انتظار تایید'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SessionAuth>
  );
}
