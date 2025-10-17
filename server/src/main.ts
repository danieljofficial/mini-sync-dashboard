import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:19006',
      "http://localhost:8081"
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 4000);
  console.log(
    ` Server running on http://localhost:${process.env.PORT || 4000}/graphql`,
  );
  console.log(
    `Subscriptions available at ws://localhost:${process.env.PORT || 4000}/graphql`,
  );
}
bootstrap();
