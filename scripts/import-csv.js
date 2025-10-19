#!/usr/bin/env node

/**
 * اسکریپت CLI برای import کردن داده‌های CSV
 * استفاده: node scripts/import-csv.js path/to/file.csv
 */

const { readFileSync } = require('fs');
const { join } = require('path');

// برای محیط development، از SQLite استفاده می‌کنیم
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SimpleD1Database {
  constructor() {
    this.db = new sqlite3.Database(':memory:'); // برای تست از memory استفاده می‌کنیم
  }

  async createCustomer(customerData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO customers (
          id, user_id, business_name, business_type, description, address,
          latitude, longitude, phone, email, website, credit_limit,
          payment_terms, credit_score, risk_level, status, verification_votes,
          verification_threshold, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const id = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      this.db.run(sql, [
        id,
        customerData.user_id,
        customerData.business_name,
        customerData.business_type,
        customerData.description,
        customerData.address,
        customerData.latitude,
        customerData.longitude,
        customerData.phone,
        customerData.email,
        customerData.website,
        customerData.credit_limit,
        customerData.payment_terms,
        customerData.credit_score,
        customerData.risk_level,
        customerData.status,
        customerData.verification_votes,
        customerData.verification_threshold,
        now,
        now
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id });
        }
      });
    });
  }

  async createUser(userData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (id, email, name, phone, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const now = new Date().toISOString();
      
      this.db.run(sql, [
        userData.id,
        userData.email,
        userData.name,
        userData.phone,
        userData.role,
        now,
        now
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: userData.id });
        }
      });
    });
  }
}

class CSVImportService {
  constructor(db) {
    this.db = db;
  }

  parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue;

      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index].trim();
      });

          const customerData = {
            token: row.token || '',
            business_name: row.name || '',
            business_type: row.category || '',
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

  parseCSVLine(line) {
    const result = [];
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

  async importCustomers(csvContent, batchSize = 100) {
    const customers = this.parseCSV(csvContent);
    let success = 0;
    let failed = 0;
    const errors = [];

    console.log(`شروع import ${customers.length} مشتری...`);

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
          errors.push(`خطا در مشتری ${customer.name}: ${error.message}`);
          console.error(`خطا در import مشتری ${customer.name}:`, error.message);
        }
      }

      if (i + batchSize < customers.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Import کامل شد. موفق: ${success}, ناموفق: ${failed}`);
    return { success, failed, errors };
  }

  async importSingleCustomer(customerData) {
    // اعتبارسنجی مختصات
    if (customerData.latitude < 25 || customerData.latitude > 40 || 
        customerData.longitude < 44 || customerData.longitude > 64) {
      throw new Error('مختصات جغرافیایی نامعتبر');
    }

    // ایجاد کاربر موقت برای مشتری
    const userId = `temp_user_${customerData.token}`;

    try {
      await this.db.createUser({
        id: userId,
        email: `temp_${customerData.token}@imported.local`,
        name: `کاربر موقت ${customerData.token}`,
        phone: '',
        role: 'user',
      });
    } catch (error) {
      // احتمالاً کاربر قبلاً وجود دارد
      console.log(`کاربر ${customerData.token} قبلاً وجود دارد`);
    }

            // ایجاد مشتری در پایگاه داده
            await this.db.createCustomer({
              user_id: userId,
              business_name: customerData.business_name,
              business_type: customerData.business_type,
              description: `مشتری وارد شده از CSV - محله: ${customerData.neighborhood_name}، شهر: ${customerData.city_name}`,
              address: customerData.address,
              latitude: customerData.latitude,
              longitude: customerData.longitude,
              phone: customerData.phones || '',
              email: '',
              website: '',
              credit_limit: 0,
              payment_terms: '',
              credit_score: Math.round(customerData.rating * 20), // تبدیل از 5 به 100
              risk_level: this.calculateRiskLevel(customerData.rating),
              status: 'approved',
            });
  }

  calculateRiskLevel(rating) {
    if (rating >= 4) return 'low';
    if (rating >= 2.5) return 'medium';
    if (rating > 0) return 'high';
    return 'unknown';
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('استفاده: node scripts/import-csv.js path/to/file.csv');
    console.log('مثال: node scripts/import-csv.js sample.csv');
    process.exit(1);
  }

  const csvPath = args[0];
  
  try {
    console.log(`شروع خواندن فایل: ${csvPath}`);
    
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    if (!csvContent.trim()) {
      console.error('فایل CSV خالی است');
      process.exit(1);
    }

    console.log(`فایل با موفقیت خوانده شد (${csvContent.length} کاراکتر)`);

    // ایجاد اتصال به پایگاه داده
    const db = new SimpleD1Database();

    console.log('شروع import داده‌ها...');
    
    const importService = new CSVImportService(db);
    const result = await importService.importCustomers(csvContent);
    
    console.log('\n=== نتایج Import ===');
    console.log(`✅ موفق: ${result.success}`);
    console.log(`❌ ناموفق: ${result.failed}`);
    console.log(`📊 مجموع: ${result.success + result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\n=== خطاها ===');
      result.errors.slice(0, 10).forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      
      if (result.errors.length > 10) {
        console.log(`... و ${result.errors.length - 10} خطای دیگر`);
      }
    }

    console.log('\n✅ Import با موفقیت تکمیل شد!');
    
  } catch (error) {
    console.error('❌ خطا در import:', error);
    process.exit(1);
  }
}

// اجرای اسکریپت
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
