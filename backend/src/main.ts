import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 3000);
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200';

  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  await app.listen(port);
  Logger.log(`Backend started on port ${port} with CORS origin ${frontendOrigin}`, 'Bootstrap');
}

void bootstrap();
