export interface EnvironmentConfig {
    ENVIRONMENT: string;
    PORT: number;
    GLOBAL_PREFIX: string;
    BASE_URL: string;
    /*
     * Database configuration
     */
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_CONNECTION_POOL_SIZE: number;
    DB_CONNECTION_NAME: string;
}