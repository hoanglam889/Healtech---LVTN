require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateArticles() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'clinic_flow_erp',
    });

    console.log('Connected to MySQL.');

    const queries = [
      "ALTER TABLE `articles` CHANGE `imageUrl` `image_url` text NULL;",
      "ALTER TABLE `articles` CHANGE `authorName` `author_name` varchar(100) NULL;",
      "ALTER TABLE `articles` CHANGE `isPublished` `is_published` tinyint(4) NOT NULL DEFAULT 1;",
      "ALTER TABLE `articles` CHANGE `createdAt` `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;",
      "ALTER TABLE `articles` CHANGE `updatedAt` `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;",
      "ALTER TABLE `articles` ADD COLUMN `user_id` int(11) NULL;",
      "ALTER TABLE `articles` ADD CONSTRAINT `fk_articles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;"
    ];

    for (const q of queries) {
      console.log('Executing:', q);
      try {
        await conn.execute(q);
        console.log('SUCCESS');
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log('Column already exists/renamed. Skipping.');
        } else {
          console.error('ERROR executing query:', err.message);
        }
      }
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    if (conn) await conn.end();
  }
}

migrateArticles();
