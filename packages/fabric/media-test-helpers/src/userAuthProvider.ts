import { ReplaySubject } from 'rxjs';

// TODO [MSW-387]: Add typings
// This method requires CORS to be disabled
import { ClientBasedAuth } from '@atlaskit/media-core';

const url =
  'https://media-playground.internal.app.dev.atlassian.io/token/user/impersonation';
const userClientBasedAuth$ = new ReplaySubject<ClientBasedAuth>(1);

export const userAuthProvider = (): Promise<ClientBasedAuth> => {
  return new Promise((resolve, reject) => {
    const subscription = userClientBasedAuth$.subscribe({
      next: auth => {
        resolve(auth);
        subscription.unsubscribe();
      },
      error: error => reject(error),
    });
  });
};

function fetchAuth(): void {
  fetch(url, {
    credentials: 'include',
  })
    .then(response => response.json())
    .then(({ clientId, token }) => {
      const { exp } = parseJwt(token);
      const timeout = exp * 1000 - Date.now();

      userClientBasedAuth$.next({
        clientId,
        token,
      });

      setTimeout(fetchAuth, timeout);
    });
}

fetchAuth();

function parseJwt(token: string) {
  const { 1: base64Url } = token.split('.');
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}
