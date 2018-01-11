jest.mock('../wsConnectionHolder');

import { WsProvider } from '../wsProvider';
import { WsConnectionHolder } from '../wsConnectionHolder';

describe('WsProvider', () => {
  const apiUrl = 'https://media.api';
  const firstClient = { clientId: 'first-id', token: 'first-token' };
  const secondClient = { clientId: 'second-id', token: 'second-token' };

  let wsProvider: WsProvider;

  beforeEach(() => {
    wsProvider = new WsProvider();
  });

  afterEach(() => {
    (WsConnectionHolder as any).mockReset();
  });

  it('should create a new instance of WsConnection holder for a client', () => {
    wsProvider.getWsConnectionHolder(apiUrl, firstClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(1);
    expect(WsConnectionHolder).toHaveBeenCalledWith(apiUrl, firstClient);
  });

  it('should reuse a WsConnectionHolder for the same client', () => {
    const first = wsProvider.getWsConnectionHolder(apiUrl, firstClient);
    const second = wsProvider.getWsConnectionHolder(apiUrl, firstClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(1);
    expect(WsConnectionHolder).toHaveBeenCalledWith(apiUrl, firstClient);
    expect(first).toBe(second);
  });

  it('should create a new instance for the second client', () => {
    const first = wsProvider.getWsConnectionHolder(apiUrl, firstClient);
    expect(WsConnectionHolder).toHaveBeenCalledWith(apiUrl, firstClient);

    const second = wsProvider.getWsConnectionHolder(apiUrl, secondClient);
    expect(WsConnectionHolder).toHaveBeenCalledWith(apiUrl, secondClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(2);
    expect(first).not.toBe(second);
  });
});
