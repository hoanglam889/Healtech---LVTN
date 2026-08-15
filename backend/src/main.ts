import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //lấy link FRONTEND_URL ở .env hoặc chạy link mặc định
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || origin.includes('localhost') || origin.includes('14.225.218.191') || origin.includes('healtech.duckdns.org')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Tương thích với đường dẫn mặc định /uploads/... trong CSDL trỏ về thư mục public/images
  app.useStaticAssets(join(__dirname, '..', 'public/images'), {
    prefix: '/uploads/',
  });

  //thêm cookie parser
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
