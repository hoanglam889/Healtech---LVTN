/**
 * One-time script to bcrypt-hash all existing plaintext passwords in the database.
 * Run with: node scripts/hash-passwords.js
 */
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const SALT_ROUNDS = 10;

// Map of phone -> plaintext password for all test accounts
const staffPasswords = [
  { phone: '004', plaintext: '1' },
  { phone: '005', plaintext: '1' },
  { phone: '006', plaintext: '1' },
  { phone: '007', plaintext: '1' },
  { phone: '008', plaintext: '1' },
];

const patientPasswords = [
  { phone: '0797551612', plaintext: '1' },
  { phone: '0901234567', plaintext: '1' },
  { phone: '0987654321', plaintext: '1' },
  { phone: '0911222333', plaintext: '1' },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'clinic_flow_erp',
  });

  console.log('Connected to database. Hashing passwords...\n');

  // Update users (staff/doctor)
  for (const { phone, plaintext } of staffPasswords) {
    const hash = await bcrypt.hash(plaintext, SALT_ROUNDS);
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE phone = ?',
      [hash, phone]
    );
    console.log(`users [${phone}]: ${result.affectedRows} row(s) updated`);
  }

  // Update patient_accounts
  for (const { phone, plaintext } of patientPasswords) {
    const hash = await bcrypt.hash(plaintext, SALT_ROUNDS);
    const [result] = await connection.execute(
      'UPDATE patient_accounts SET password_hash = ?, is_active = 1 WHERE phone = ?',
      [hash, phone]
    );
    console.log(`patient_accounts [${phone}]: ${result.affectedRows} row(s) updated`);
  }

  await connection.end();
  console.log('\nDone! All passwords hashed successfully.');
}

main().catch(console.error);
