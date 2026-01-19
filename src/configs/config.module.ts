import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnectionService } from './services/db-connection.service';

// Create the environment object as a constant provider

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(
            DbConnectionService.getTypeOrmConfig(new AppConfigService(new ConfigService())),
        )
    ],
    providers: [
        ConfigService,
        AppConfigService,
        DbConnectionService,
    ],
    exports: [AppConfigService],
})
export class AppConfigModule { }
