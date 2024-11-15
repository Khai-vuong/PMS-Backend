import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',  // Development origin
      'https://pms-frontend-production.up.railway.app'  // Production origin
    ],
    credentials: true, // Allow credentials (cookies)
  });

  await app.listen(4000); //must be at last line}
}
bootstrap();

