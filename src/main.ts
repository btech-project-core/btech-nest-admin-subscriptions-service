import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs.config';
import { join } from 'path';
import { createValidationExceptionFactory } from './common/factories/create-validation-exception.factory';
import { SERVICE_NAME } from './config/constants';
import { ServiceIdentifierInterceptor } from './common/interceptors/service-identifier.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Admin-Subscriptions-Service');

  // 1. NATS Microservice (tu configuración original)
  const natsApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.messaging.servers,
        queue: 'admin-subscriptions-service-queue',
        reconnect: true,
        maxReconnectAttempts: -1,
        reconnectTimeWait: 2000,
        waitOnFirstConnect: true,
      },
    },
  );
  natsApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: createValidationExceptionFactory(SERVICE_NAME),
    }),
  );

  natsApp.useGlobalInterceptors(
    new LoggingInterceptor(SERVICE_NAME),
    new ServiceIdentifierInterceptor(SERVICE_NAME),
  );

  // 2. gRPC Microservice (para auth-service y account-service)
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'adminSubscriptions',
        protoPath: join(process.cwd(), 'src/common/proto/subscribers.proto'),
        url: `0.0.0.0:${envs.grpc.port}`,
      },
    },
  );

  grpcApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: createValidationExceptionFactory(SERVICE_NAME),
    }),
  );

  grpcApp.useGlobalInterceptors(
    new LoggingInterceptor(SERVICE_NAME),
    new ServiceIdentifierInterceptor(SERVICE_NAME),
  );

  // Iniciar ambos microservicios
  await natsApp.listen();
  await grpcApp.listen();

  logger.log(
    `🚀 NATS Microservice running - Queue: admin-subscriptions-service-queue`,
  );
  logger.log(`🚀 gRPC Server running on port ${envs.grpc.port}`);
}
bootstrap();
