import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from './types/env-config.types';
import { ENVIRONMENTS } from './config.constants';

@Injectable()
export class AppConfigService {
    public readonly ENV_CONFIG: EnvironmentConfig;
    public readonly IS_PRODUCTION: boolean;
    constructor(private readonly configService: ConfigService) {
        this.IS_PRODUCTION = this.configService.get<string>('ENVIRONMENT', ENVIRONMENTS.DEVELOPMENT) === ENVIRONMENTS.PRODUCTION;

        this.ENV_CONFIG = {
            ENVIRONMENT: this.configService.get<string>('ENVIRONMENT', 'DEVELOPMENT'),
            PORT: this.configService.get<number>('PORT', 3000),
            GLOBAL_PREFIX: this.configService.get<string>('GLOBAL_PREFIX', 'api'),
            BASE_URL: this.configService.get<string>('BASE_URL', 'http://localhost'),
            // Add more environment variables here as needed
            DB_HOST: this.configService.get<string>('DB_HOST', 'localhost'),
            DB_PORT: this.configService.get<number>('DB_PORT', 5432),
            DB_USERNAME: this.configService.get<string>('DB_USERNAME', 'postgres'),
            DB_PASSWORD: this.configService.get<string>('DB_PASSWORD', 'postgres'),
            DB_NAME: this.configService.get<string>('DB_NAME', 'postgres'),
            DB_CONNECTION_POOL_SIZE: this.configService.get<number>('DB_CONNECTION_POOL_SIZE', 10),
            DB_CONNECTION_NAME: this.configService.get<string>('DB_CONNECTION_NAME', 'default'),
        };
    }
}

