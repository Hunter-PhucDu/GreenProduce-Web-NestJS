import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';
import { HttpExceptionFilter } from 'modules/shared/filters/http-exception.filter';
import { ResponseTransformInterceptor } from 'modules/shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('app.prefix'));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await setupSwagger(app);
  await startPort(app);
}

async function setupSwagger(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  const docBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(configService.get('app.name'))
    .setDescription(configService.get('app.name'))
    .setVersion(configService.get('app.prefix'));

  for (const server of configService.get('app.swagger.servers')) {
    docBuilder.addServer(server.url);
  }

  const options = docBuilder.build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${configService.get('app.prefix')}/docs`, app, document, {
    customSiteTitle: configService.get('app.name'),
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
    },
  });
}

async function startPort(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port'));

  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);
  console.log(`Swagger is running on: ${appUrl}/${configService.get<string>('app.prefix')}/docs`);
}

bootstrap();
