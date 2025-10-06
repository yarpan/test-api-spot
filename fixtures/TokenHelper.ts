import { APIRequestContext } from "playwright";
import { Auth } from "../app/controllers/Auth";
import fs from "fs";

export const SPOTIFY_CONFIG = {
  TOKEN_FILE_PATH: "tokens.json",
  TOKEN_BUFFER_TIME: 300,
  AUTH_URL: "https://accounts.spotify.com/api/token",
} as const;

export class TokenHelper {
  private static validateTokenStructure(tokens: any) {
    return (
      typeof tokens === "object" &&
      typeof tokens.access_token === "string" &&
      typeof tokens.token_type === "string" &&
      typeof tokens.scope === "string" &&
      typeof tokens.expires_in === "number" &&
      typeof tokens.obtainDate === "number" &&
      typeof tokens.expirationDate === "number" &&
      tokens.access_token.length > 0
    );
  }

  static async getTokens(
    tokenPath: string = SPOTIFY_CONFIG.TOKEN_FILE_PATH
  ): Promise<SpotifyTokenResponse> {
    if (!fs.existsSync(tokenPath)) {
      throw new Error(
        `Token file '${tokenPath}' does not exist. Please generate tokens using the token-setup project.`
      );
    }
    const tokenData = fs.readFileSync(tokenPath, { encoding: "utf8" });
    const tokens = JSON.parse(tokenData);

    if (!this.validateTokenStructure(tokens)) {
      throw new Error(
        `Invalid token structure in '${tokenPath}'. Please regenerate tokens.`
      );
    }

    return tokens;
  }

  static isTokenExpired(tokens: SpotifyTokenResponse): boolean {
    const currentTime = Date.now() / 1000;
    const expirationWithBuffer =
      tokens.expirationDate - SPOTIFY_CONFIG.TOKEN_BUFFER_TIME;
    return currentTime >= expirationWithBuffer;
  }

  static async refreshTokenIfNeeded(
    tokens: SpotifyTokenResponse,
    apiContext: APIRequestContext,
    tokenPath: string = SPOTIFY_CONFIG.TOKEN_FILE_PATH
  ): Promise<SpotifyTokenResponse> {
    if (!this.isTokenExpired(tokens)) {
      return tokens;
    }

    const auth = new Auth(apiContext);
    const refreshedTokens = await auth.refreshAndSaveToken(tokenPath);
    return refreshedTokens;
  }
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  obtainDate: number;
  expirationDate: number;
}
