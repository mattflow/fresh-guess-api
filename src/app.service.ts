import { Injectable, Logger } from "@nestjs/common";
import puppeteer from "puppeteer";
import { z } from "zod";

export const Credentials = z.object({
  aId: z.string(),
  sId: z.string(),
});
export type Credentials = z.infer<typeof Credentials>;
const _RottenTomatoes = z.object({
  thirdParty: z.object({
    algoliaSearch: Credentials,
  }),
});

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async getCredentials() {
    this.logger.log("Launching headless browser");
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    this.logger.log("Browser launched");

    return await browser
      .newPage()
      .then(async (page) => {
        this.logger.log("Navigating to https://www.rottentomatoes.com");
        await page.goto("https://www.rottentomatoes.com");
        this.logger.log("Retrieving RottenTomatoes object from site");
        const result = await page.evaluate(() => {
          // @ts-expect-error
          return RottenTomatoes;
        });
        this.logger.log("Parsing evaluated result");
        const rottenTomatoes = _RottenTomatoes.parse(result);
        this.logger.log("Successfully parsed result");
        return rottenTomatoes.thirdParty.algoliaSearch;
      })
      .finally(() => {
        this.logger.log("Closing browser");
        browser.close();
        this.logger.log("Browser closed");
      });
  }
}
