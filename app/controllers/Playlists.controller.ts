import { APIRequestContext } from "@playwright/test";

export class Playlists {
  request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getPlaylistById(id: string) {
    const response = await this.request.get(
      `https://api.spotify.com/v1/playlists/${id}`,
      {}
    );

    return response;
  }

  async createPlaylist(
    userId: string,
    data: {
      name: string;
      description: string;
      public: boolean;
    }
  ) {
    const response = await this.request.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        data: data,
      }
    );

    return response;
  }
}
