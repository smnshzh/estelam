"use client";

import { useState, useEffect } from "react";
import { reverseGeocodingService, FeatureResponse } from "@/lib/reverse-geocoding";

interface LocationInfoProps {
  latitude: number;
  longitude: number;
  onLocationInfoChange?: (info: {
    neighborhood: string;
    city: string;
    province: string;
    fullAddress: string;
  }) => void;
}

export default function LocationInfo({ latitude, longitude, onLocationInfoChange }: LocationInfoProps) {
  const [locationInfo, setLocationInfo] = useState<{
    neighborhood: FeatureResponse | null;
    city: FeatureResponse | null;
    province: FeatureResponse | null;
    address: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (latitude && longitude) {
      loadLocationInfo();
    }
  }, [latitude, longitude]);

  const loadLocationInfo = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const info = await reverseGeocodingService.getCompleteLocationInfo(latitude, longitude);
      setLocationInfo(info);
      
      if (onLocationInfoChange) {
        onLocationInfoChange({
          neighborhood: info.neighborhood?.name || '',
          city: info.city?.name || '',
          province: info.province?.name || '',
          fullAddress: reverseGeocodingService.formatCompleteAddress(info)
        });
      }
    } catch (error) {
      console.error('Error loading location info:', error);
      setError('خطا در دریافت اطلاعات جغرافیایی');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <p className="text-sm text-blue-700">در حال دریافت اطلاعات جغرافیایی...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={loadLocationInfo}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!locationInfo) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-green-900 mb-3">اطلاعات جغرافیایی</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {locationInfo.neighborhood && (
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 mb-1">محله:</div>
            <div className="font-medium text-gray-900">{locationInfo.neighborhood.name}</div>
          </div>
        )}
        
        {locationInfo.city && (
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 mb-1">شهر:</div>
            <div className="font-medium text-gray-900">{locationInfo.city.name}</div>
          </div>
        )}
        
        {locationInfo.province && (
          <div className="bg-white rounded p-3">
            <div className="text-gray-600 mb-1">استان:</div>
            <div className="font-medium text-gray-900">{locationInfo.province.name}</div>
          </div>
        )}
      </div>

      {locationInfo.address?.formatted_address && (
        <div className="mt-4 bg-white rounded p-3">
          <div className="text-gray-600 mb-1 text-sm">آدرس کامل:</div>
          <div className="font-medium text-gray-900">{locationInfo.address.formatted_address}</div>
        </div>
      )}

      <div className="mt-3 text-xs text-green-700">
        اطلاعات از API معکوس جغرافیایی فارسی دریافت شده است
      </div>
    </div>
  );
}
