import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenseaModule } from './opensea.module';

async function bootstrap() {
  const app = await NestFactory.create(OpenseaModule);

  const globalPrefix = 'api/opensea';
  app.setGlobalPrefix(globalPrefix);

  const port = 4001;
  
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
