import { Server } from 'kakapo';

import { createApiRouter, createMediaPlaygroundRouter } from './routers';
import {
  createDatabase,
  generateUserData,
  generateTenantData,
} from './database';

export class MediaMock {
  private server = new Server();

  constructor() {}

  enable() {
    this.server.use(createDatabase());
    this.server.use(createMediaPlaygroundRouter());
    this.server.use(createApiRouter());

    generateUserData();
    generateTenantData();
  }
}

export const mediaMock = new MediaMock();
