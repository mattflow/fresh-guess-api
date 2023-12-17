import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { AppService, Credentials } from "./app.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";

const CREDENTIALS_CACHE_KEY = "credentials";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  async getCredentials() {
    const cachedCredentials = await this.cacheManager.get<Credentials>(
      CREDENTIALS_CACHE_KEY,
    );
    if (cachedCredentials) {
      this.logger.log("Cached credentials found");
      return cachedCredentials;
    }
    this.logger.log("No cached credentials");
    this.logger.log("Fetching fresh credentials");
    const freshCredentials = await this.appService.getCredentials();
    this.logger.log("Caching fresh credentials");
    this.cacheManager.set(CREDENTIALS_CACHE_KEY, freshCredentials, 3600);
    return freshCredentials;
  }
}
