import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UniswapModule } from './uniswap.module';

async function bootstrap() {
  const app = await NestFactory.create(UniswapModule);

  const globalPrefix = 'api/uniswap';
  app.setGlobalPrefix(globalPrefix);

  const port = 4000;

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
