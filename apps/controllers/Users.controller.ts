import { APIRequestContext } from "playwright";

export class Users {
  request: APIRequestContext;
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getCurrentUsersProfile() {
    const userIdResponse = await this.request.get(
      "https://api.spotify.com/v1/me",
      {}
    );
    return userIdResponse;
  }
}
