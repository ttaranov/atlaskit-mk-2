export function auth(startUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let authWindow: Window | null = null;
    let authWindowInterval: number;

    const handleAuthWindowMessage = (event: MessageEvent) => {
      if (event.source !== authWindow) {
        return;
      }

      const { data } = event;
      if (typeof data !== 'object') {
        return;
      }

      switch (data.type) {
        case 'outbound-auth:success':
          finish();
          resolve();
          break;

        case 'outbound-auth:failure':
          finish();
          reject(new Error(data.message));
          break;
      }
    };

    const handleAuthWindowInterval = () => {
      if (authWindow && authWindow.closed) {
        finish();
        reject(new Error('The auth window was closed'));
      }
    };

    const start = () => {
      window.addEventListener('message', handleAuthWindowMessage);
      authWindow = window.open(startUrl, startUrl);
      authWindowInterval = window.setInterval(handleAuthWindowInterval, 500);
    };

    const finish = () => {
      clearInterval(authWindowInterval);
      window.removeEventListener('message', handleAuthWindowMessage);
      if (authWindow) {
        authWindow.close();
        authWindow = null;
      }
    };

    start();
  });
}
