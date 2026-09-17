import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function getAvailablePort(startPort: number) {
  const net = await import('node:net');

  for (let port = startPort; port < startPort + 20; port += 1) {
    const isFree = await new Promise<boolean>((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port, '0.0.0.0');
    });

    if (isFree) {
      return port;
    }
  }

  return startPort;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const configuredPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const port = await getAvailablePort(configuredPort);
  if (port !== configuredPort) {
    console.log(`Port ${configuredPort} is busy; using fallback port ${port}`);
  }

  await app.listen(port);
}

bootstrap();
