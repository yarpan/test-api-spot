import { APIRequestContext } from "playwright";
import { writeFileSync } from "fs";

export class Auth {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
    if (!this.isCredentialsExist()) {
      throw new Error(`Some of env variable are not exist`);
    }
  }

  isCredentialsExist() {
    if (
      process.env.REDIRECT_URL &&
      process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET
    ) {
      return true;
    } else {
      return false;
    }
  }

  async getAndSaveToken(path = "tokens.json") {
    const response = await this.request.post(
      "https://accounts.spotify.com/api/token",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        params: {
          grant_type: "authorization_code",
          code: process.env.AUTHORIZATION_CODE!,
          redirect_uri: process.env.REDIRECT_URL!,
        },
        failOnStatusCode: true,
      }
    );

    const fullTokens = await response.json();

    const tokensWithDates = {
      ...fullTokens,
      obtainDate: new Date().getTime() / 1000,
      expirationDate: new Date().getTime() / 1000 + 3600,
    };

    writeFileSync(path, JSON.stringify(tokensWithDates));

    return fullTokens;
  }

  async refreshAndSaveToken(path = "tokens.json") {
    const params = {
      grant_type: "refresh_token",
      refresh_token: process.env.REFRESH_TOKEN!,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    };

    const url = "https://accounts.spotify.com/api/token";

    const body = await this.request.post(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: params,
      failOnStatusCode: true,
    });

    const fullTokens = await body.json();

    const tokensWithDates = {
      ...fullTokens,
      obtainDate: new Date().getTime() / 1000,
      expirationDate: new Date().getTime() / 1000 + 3600,
    };

    writeFileSync("tokens.json", JSON.stringify(tokensWithDates));

    return tokensWithDates;
  }
}
