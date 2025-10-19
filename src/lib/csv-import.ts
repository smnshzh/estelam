/**
 * اسکریپت import داده‌های CSV به پایگاه داده
 */

import { D1DatabaseService } from './d1-database';
import { reverseGeocodingService } from './reverse-geocoding';

interface CustomerData {
  token: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phones?: string;
  rating: number;
  neighborhood_name: string;
  city_name: string;
}

export class CSVImportService {
  private db: D1DatabaseService;

  constructor(db: D1DatabaseService) {
    this.db = db;
  }

  /**
   * پارس کردن فایل CSV
   */
  parseCSV(csvContent: string): CustomerData[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data: CustomerData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue;

      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index].trim();
      });

      // تبدیل به فرمت مورد نظر
      const customerData: CustomerData = {
        token: row.token || '',
        name: row.name || '',
        category: row.category || '',
        address: row.address || '',
        latitude: parseFloat(row.latitude) || 0,
        longitude: parseFloat(row.longitude) || 0,
        phones: row.phones || '',
        rating: parseFloat(row.rating) || 0,
        neighborhood_name: row.neighborhood_name || '',
        city_name: row.city_name || '',
      };

      data.push(customerData);
    }

    return data;
  }

  /**
   * پارس کردن یک خط CSV با در نظر گیری کاماهای داخل کوتیشن
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  /**
   * import کردن داده‌ها به پایگاه داده
   */
  async importCustomers(csvContent: string, batchSize: number = 100): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const customers = this.parseCSV(csvContent);
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    console.log(`شروع import ${customers.length} مشتری...`);

    // پردازش به صورت batch
    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(i, i + batchSize);
      
      for (const customer of batch) {
        try {
          await this.importSingleCustomer(customer);
          success++;
          
          if (success % 50 === 0) {
            console.log(`وارد شده: ${success}/${customers.length}`);
          }
        } catch (error) {
          failed++;
          errors.push(`خطا در مشتری ${customer.name}: ${error}`);
          console.error(`خطا در import مشتری ${customer.name}:`, error);
        }
      }

      // کمی تاخیر برای جلوگیری از overload
      if (i + batchSize < customers.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Import کامل شد. موفق: ${success}, ناموفق: ${failed}`);
    return { success, failed, errors };
  }

  /**
   * import کردن یک مشتری
   */
  private async importSingleCustomer(customerData: CustomerData): Promise<void> {
    // اعتبارسنجی مختصات
    if (!reverseGeocodingService.validateCoordinates(customerData.latitude, customerData.longitude)) {
      throw new Error('مختصات جغرافیایی نامعتبر');
    }

    // دریافت آدرس از API
    const geocodingResult = await reverseGeocodingService.getAddressFromCoordinates(
      customerData.latitude,
      customerData.longitude
    );

    let finalAddress = customerData.address;
    if (geocodingResult) {
      finalAddress = reverseGeocodingService.formatAddressForDisplay(
        geocodingResult.formatted_address,
        geocodingResult.components
      );
    }

    // ایجاد کاربر موقت برای مشتری
    const userId = `temp_user_${customerData.token}`;

    // ایجاد مشتری در پایگاه داده
    await this.db.createCustomer({
      user_id: userId,
      business_name: customerData.name,
      business_type: customerData.category,
      description: `مشتری وارد شده از CSV - محله: ${customerData.neighborhood_name}`,
      address: finalAddress,
      latitude: customerData.latitude,
      longitude: customerData.longitude,
      phone: customerData.phones || '',
      email: '',
      website: '',
      credit_limit: 0,
      payment_terms: '',
      credit_score: Math.round(customerData.rating * 20), // تبدیل از 5 به 100
      risk_level: this.calculateRiskLevel(customerData.rating),
      status: 'approved', // مشتریان وارد شده از CSV را تایید شده در نظر می‌گیریم
    });
  }

  /**
   * محاسبه سطح ریسک بر اساس امتیاز
   */
  private calculateRiskLevel(rating: number): 'low' | 'medium' | 'high' | 'unknown' {
    if (rating >= 4) return 'low';
    if (rating >= 2.5) return 'medium';
    if (rating > 0) return 'high';
    return 'unknown';
  }

  /**
   * ایجاد کاربران موقت برای مشتریان
   */
  async createTempUsers(customers: CustomerData[]): Promise<void> {
    const uniqueTokens = [...new Set(customers.map(c => c.token))];
    
    for (const token of uniqueTokens) {
      try {
        await this.db.createUser({
          id: `temp_user_${token}`,
          email: `temp_${token}@imported.local`,
          name: `کاربر موقت ${token}`,
          phone: '',
          role: 'user',
        });
      } catch (error) {
        // احتمالاً کاربر قبلاً وجود دارد
        console.log(`کاربر ${token} قبلاً وجود دارد`);
      }
    }
  }
}

/**
 * تابع کمکی برای اجرای import
 */
export async function importCustomersFromCSV(
  csvContent: string,
  db: D1DatabaseService
): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const importService = new CSVImportService(db);
  
  // ابتدا کاربران موقت را ایجاد کن
  const customers = importService.parseCSV(csvContent);
  await importService.createTempUsers(customers);
  
  // سپس مشتریان را import کن
  return await importService.importCustomers(csvContent);
}
