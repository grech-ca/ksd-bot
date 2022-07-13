import { NestFactory } from '@nestjs/core';
import 'isomorphic-fetch';

import { AppModule } from './app.module';

const { IS_TS_NODE } = process.env;

if (!IS_TS_NODE) require('module-alias/register');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
void bootstrap();
