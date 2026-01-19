import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configs/config.service';

@Injectable()
export class AppService {
  constructor(
    private readonly appConfigService: AppConfigService,
  ) { }

  getHello(): string {
    return `Hello World! Running in ${this.appConfigService.ENV_CONFIG.ENVIRONMENT} mode on port ${this.appConfigService.ENV_CONFIG.PORT}`;
  }
}
