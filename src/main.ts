import * as pkg from '../package.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfigService } from './configs/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get(AppConfigService);

  const {
    BASE_URL,
    PORT,
    GLOBAL_PREFIX,
  } = appConfigService?.ENV_CONFIG;

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({ origin: true, credentials: true });
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().disable?.('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(appConfigService));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle(`${pkg.name} APIs`)
    .setDescription(`${pkg.name} Backend APIs`)
    .setVersion(`${pkg.version}`)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfigService.ENV_CONFIG.PORT, () => {
    Logger.log(`Listening at http://${BASE_URL}:${PORT}/${GLOBAL_PREFIX}`);
  });
}
bootstrap();
