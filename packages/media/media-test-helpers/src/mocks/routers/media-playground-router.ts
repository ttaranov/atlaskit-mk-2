import { Router } from 'kakapo';

export function createMediaPlaygroundRouter(): Router {
  const router = new Router({
    host: 'https://api-private.dev.atlassian.com',
    requestDelay: 10,
  });

  router.get('/media-playground/api/token/user/impersonation', () => {});

  return router;
}
