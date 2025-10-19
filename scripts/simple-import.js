#!/usr/bin/env node

/**
 * اسکریپت ساده برای import کردن داده‌های CSV به D1
 * استفاده: node scripts/simple-import.js sample.csv
 */

const { readFileSync } = require('fs');
const { execSync } = require('child_process');

class SimpleCSVImporter {
  constructor() {
    this.batchSize = 100;
    this.successCount = 0;
    this.errorCount = 0;
    this.errors = [];
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

      data.push(row);
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

  async executeSQL(sql) {
    try {
      const result = execSync(`wrangler d1 execute estelam --command "${sql}"`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return result;
    } catch (error) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async importCustomers(csvData) {
    console.log(`شروع import ${csvData.length} مشتری...`);

    for (let i = 0; i < csvData.length; i += this.batchSize) {
      const batch = csvData.slice(i, i + this.batchSize);
      
      for (const customer of batch) {
        try {
          await this.importSingleCustomer(customer);
          this.successCount++;
          
          if (this.successCount % 50 === 0) {
            console.log(`وارد شده: ${this.successCount}/${csvData.length}`);
          }
        } catch (error) {
          this.errorCount++;
          this.errors.push(`خطا در مشتری ${customer.name}: ${error.message}`);
          console.error(`خطا در import مشتری ${customer.name}:`, error.message);
        }
      }

      // توقف کوتاه بین batch ها
      if (i + this.batchSize < csvData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Import کامل شد. موفق: ${this.successCount}, ناموفق: ${this.errorCount}`);
    return { success: this.successCount, failed: this.errorCount, errors: this.errors };
  }

  async importSingleCustomer(customerData) {
    // اعتبارسنجی مختصات
    const lat = parseFloat(customerData.latitude);
    const lng = parseFloat(customerData.longitude);
    
    if (lat < 25 || lat > 40 || lng < 44 || lng > 64) {
      throw new Error('مختصات جغرافیایی نامعتبر');
    }

    // ایجاد کاربر موقت
    const userId = `temp_user_${customerData.token}`;
    const userEmail = `temp_${customerData.token}@imported.local`;
    const userName = `کاربر موقت ${customerData.token}`;

    // ایجاد مشتری
    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const rating = parseFloat(customerData.rating) || 0;
    const creditScore = Math.round(rating * 20);
    const riskLevel = this.calculateRiskLevel(rating);

    // SQL برای ایجاد کاربر
    const userSQL = `
      INSERT OR IGNORE INTO users (id, email, name, phone, role, created_at, updated_at)
      VALUES ('${userId}', '${userEmail}', '${userName}', '', 'user', '${now}', '${now}')
    `;

    // SQL برای ایجاد مشتری
    const customerSQL = `
      INSERT INTO customers (
        id, user_id, business_name, business_type, description, address,
        latitude, longitude, phone, email, website, credit_limit,
        payment_terms, credit_score, risk_level, status, verification_votes,
        verification_threshold, created_at, updated_at
      ) VALUES (
        '${customerId}',
        '${userId}',
        '${customerData.name.replace(/'/g, "''")}',
        '${customerData.category.replace(/'/g, "''")}',
        'مشتری وارد شده از CSV - محله: ${customerData.neighborhood_name}، شهر: ${customerData.city_name}',
        '${customerData.address.replace(/'/g, "''")}',
        ${lat},
        ${lng},
        '${customerData.phones || ''}',
        '',
        '',
        0,
        '',
        ${creditScore},
        '${riskLevel}',
        'approved',
        0,
        3,
        '${now}',
        '${now}'
      )
    `;

    await this.executeSQL(userSQL);
    await this.executeSQL(customerSQL);
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
    console.log('استفاده: node scripts/simple-import.js path/to/file.csv');
    console.log('مثال: node scripts/simple-import.js sample.csv');
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

    const importer = new SimpleCSVImporter();
    const customers = importer.parseCSV(csvContent);
    
    console.log(`تعداد مشتریان یافت شده: ${customers.length}`);
    
    const result = await importer.importCustomers(customers);
    
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
