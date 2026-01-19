import { DataSourceOptions, LoggerOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config.service';
import path from 'path';
import { UrlShortnerEntity } from '../../modules/url-shortner/entities/url-shortner.entity';
import { StockEntity } from '../../modules/holdings/entities/stock.entity';
import { HoldingEntity } from '../../modules/holdings/entities/holding.entity';
import { CommentEntity } from '../../modules/comments/entities/comment.entity';
import { PostEntity } from '../../modules/comments/entities/post.entity';

@Injectable()
export class DbConnectionService {
    static getTypeOrmConfig(appConfigService: AppConfigService, migrationsRun: boolean = false): DataSourceOptions {

        const migrationDir = path.join(__dirname, '../../migrations/*.{js,ts}');

        const {
            DB_HOST,
            DB_PORT,
            DB_USERNAME,
            DB_PASSWORD,
            DB_NAME,
            DB_CONNECTION_POOL_SIZE,
            DB_CONNECTION_NAME,
        } = appConfigService.ENV_CONFIG;

        const { IS_PRODUCTION } = appConfigService;

        const logging: LoggerOptions = IS_PRODUCTION ? ['error'] : ['query', 'error'];

        const config: DataSourceOptions = {
            name: DB_CONNECTION_NAME,
            type: 'postgres',
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME,
            logging,
            poolSize: DB_CONNECTION_POOL_SIZE,
            entities: [UrlShortnerEntity, StockEntity, HoldingEntity, CommentEntity, PostEntity],
            migrationsRun,
            synchronize: IS_PRODUCTION ? false : true,
            // migrations: [migrationDir]
        };
        return config;
    }
}