import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '../configs/config.module';
import { UrlShortnerModule } from '../modules/url-shortner/url-shortner.module';
import { RequestIdMiddleware } from '../common/middleware/request-id.middleware';

@Module({
  imports: [
    AppConfigModule,
    UrlShortnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
