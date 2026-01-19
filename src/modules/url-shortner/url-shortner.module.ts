import { Module } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import { UrlShortnerController } from './url-shortner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortnerEntity } from './entities/url-shortner.entity';

@Module({
  controllers: [UrlShortnerController],
  providers: [UrlShortnerService],
  imports: [
    TypeOrmModule.forFeature([UrlShortnerEntity])
  ]
})
export class UrlShortnerModule { }
