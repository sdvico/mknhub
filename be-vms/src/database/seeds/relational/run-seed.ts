import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // Get the seed services

  // Run the seeds in order
  // await roleSeedService.run();

  await app.close();
};

void runSeed();
