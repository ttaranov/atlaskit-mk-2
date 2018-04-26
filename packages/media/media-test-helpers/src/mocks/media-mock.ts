import { Router, Server } from 'kakapo';

export class MediaMock {
  private server = new Server();

  enable() {
    const router = new Router({
      host: 'https://dt-api.dev.atl-paas.net',
      requestDelay: 10,
    });

    router.get('/collection/:collectionName/items', () => {
      return {
        data: {
          nextInclusiveStartKey: 121,
          contents: [],
        },
      };
    });

    //dt-api.dev.atl-paas.net/collection/recents/items?sortDirection=desc&limit=30

    this.server.use(router);
  }
}

export const mediaMock = new MediaMock();
