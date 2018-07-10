import { mapAuthToQueryParameters } from '../../models/auth-query-parameters';

describe('AuthQueryParameters', () => {
  describe('mapAuthToQueryParameters', () => {
    const clientId = 'some-client-id';
    const asapIssuer = 'some-asap-issuer';
    const token = 'some-token';

    it('should return correct query parameters for client based auth', () => {
      expect(
        mapAuthToQueryParameters({
          clientId,
          token,
        }),
      ).toEqual({ client: clientId, token });
    });

    it('should return correct query parameters for asap based auth', () => {
      expect(
        mapAuthToQueryParameters({
          asapIssuer,
          token,
        }),
      ).toEqual({ issuer: asapIssuer, token });
    });
  });
});
