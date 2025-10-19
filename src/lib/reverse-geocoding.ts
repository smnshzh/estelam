/**
 * سرویس معکوس جغرافیایی برای تبدیل مختصات به آدرس فارسی
 */

export interface GeocodingComponent {
  full_name: string;
  short_name: string;
  type: string;
  id: string;
}

export interface GeocodingResponse {
  formatted_address: string;
  components: GeocodingComponent[];
}

export interface FeatureResponse {
  name: string;
  geometry: {
    coordinates: number[][][];
    type: string;
  };
}

export class ReverseGeocodingService {
  private baseUrl = 'https://reverse-geocoding.raah.ir/v1/';

  /**
   * تبدیل مختصات جغرافیایی به آدرس فارسی
   */
  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<GeocodingResponse | null> {
    try {
      const url = `${this.baseUrl}?location=${longitude},${latitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  }

  /**
   * دریافت اطلاعات محله از مختصات
   */
  async getNeighborhoodFromCoordinates(latitude: number, longitude: number): Promise<FeatureResponse | null> {
    try {
      const url = `${this.baseUrl}features?result_type=neighborhood&location=${longitude},${latitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FeatureResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting neighborhood:', error);
      return null;
    }
  }

  /**
   * دریافت اطلاعات شهر از مختصات
   */
  async getCityFromCoordinates(latitude: number, longitude: number): Promise<FeatureResponse | null> {
    try {
      const url = `${this.baseUrl}features?result_type=city&location=${longitude},${latitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FeatureResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting city:', error);
      return null;
    }
  }

  /**
   * دریافت اطلاعات استان از مختصات
   */
  async getProvinceFromCoordinates(latitude: number, longitude: number): Promise<FeatureResponse | null> {
    try {
      const url = `${this.baseUrl}features?result_type=province&location=${longitude},${latitude}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FeatureResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting province:', error);
      return null;
    }
  }

  /**
   * دریافت اطلاعات کامل جغرافیایی (محله، شهر، استان)
   */
  async getCompleteLocationInfo(latitude: number, longitude: number): Promise<{
    neighborhood: FeatureResponse | null;
    city: FeatureResponse | null;
    province: FeatureResponse | null;
    address: GeocodingResponse | null;
  }> {
    try {
      const [neighborhood, city, province, address] = await Promise.all([
        this.getNeighborhoodFromCoordinates(latitude, longitude),
        this.getCityFromCoordinates(latitude, longitude),
        this.getProvinceFromCoordinates(latitude, longitude),
        this.getAddressFromCoordinates(latitude, longitude)
      ]);

      return {
        neighborhood,
        city,
        province,
        address
      };
    } catch (error) {
      console.error('Error getting complete location info:', error);
      return {
        neighborhood: null,
        city: null,
        province: null,
        address: null
      };
    }
  }

  /**
   * استخراج اجزای مختلف آدرس
   */
  extractAddressComponents(components: GeocodingComponent[]) {
    const addressParts = {
      city: '',
      county: '',
      neighborhood: '',
      street: '',
      plate: '',
    };

    components.forEach(component => {
      switch (component.type) {
        case 'city':
          addressParts.city = component.full_name;
          break;
        case 'county':
          addressParts.county = component.full_name;
          break;
        case 'neighborhood':
          addressParts.neighborhood = component.full_name;
          break;
        case 'street':
          addressParts.street = component.full_name;
          break;
        case 'plate':
          addressParts.plate = component.full_name;
          break;
      }
    });

    return addressParts;
  }

  /**
   * فرمت کردن آدرس برای نمایش
   */
  formatAddressForDisplay(formattedAddress: string, components: GeocodingComponent[]): string {
    // اگر آدرس فرمت شده موجود است، از آن استفاده کن
    if (formattedAddress) {
      return formattedAddress;
    }

    // در غیر این صورت، از اجزا آدرس بساز
    const parts = this.extractAddressComponents(components);
    const addressParts = [];

    if (parts.city) addressParts.push(parts.city);
    if (parts.neighborhood) addressParts.push(parts.neighborhood);
    if (parts.street) addressParts.push(parts.street);
    if (parts.plate) addressParts.push(parts.plate);

    return addressParts.join('،');
  }

  /**
   * فرمت کردن آدرس کامل با استفاده از اطلاعات جغرافیایی
   */
  formatCompleteAddress(locationInfo: {
    neighborhood: FeatureResponse | null;
    city: FeatureResponse | null;
    province: FeatureResponse | null;
    address: GeocodingResponse | null;
  }): string {
    const addressParts = [];

    if (locationInfo.neighborhood?.name) {
      addressParts.push(locationInfo.neighborhood.name);
    }
    if (locationInfo.city?.name) {
      addressParts.push(locationInfo.city.name);
    }
    if (locationInfo.province?.name) {
      addressParts.push(locationInfo.province.name);
    }

    // اگر آدرس اصلی موجود است، آن را اضافه کن
    if (locationInfo.address?.formatted_address) {
      return locationInfo.address.formatted_address;
    }

    return addressParts.join('،');
  }

  /**
   * اعتبارسنجی مختصات جغرافیایی
   */
  validateCoordinates(latitude: number, longitude: number): boolean {
    // مختصات ایران تقریباً
    const minLat = 25.0;
    const maxLat = 40.0;
    const minLng = 44.0;
    const maxLng = 64.0;

    return (
      latitude >= minLat && latitude <= maxLat &&
      longitude >= minLng && longitude <= maxLng
    );
  }
}

// نمونه سراسری سرویس
export const reverseGeocodingService = new ReverseGeocodingService();
