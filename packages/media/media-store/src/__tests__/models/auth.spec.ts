import { isClientBasedAuth, isAsapBasedAuth } from '../../models/auth';

describe('Auth', () => {
  const clientBasedAuth = {
    clientId: 'some-client-id',
    token: 'some-token',
  };

  const asapBasedAuth = {
    asapIssuer: 'some-asap-issuer',
    token: 'some-token',
  };

  describe('isClientBasedAuth', () => {
    it('should return true for client based auth', () => {
      expect(isClientBasedAuth(clientBasedAuth)).toEqual(true);
    });

    it('should return false for asap based auth', () => {
      expect(isClientBasedAuth(asapBasedAuth)).toEqual(false);
    });
  });

  describe('isAsapBasedAuth', () => {
    it('should return false for client based auth', () => {
      expect(isAsapBasedAuth(clientBasedAuth)).toEqual(false);
    });

    it('should return true for asap based auth', () => {
      expect(isAsapBasedAuth(asapBasedAuth)).toEqual(true);
    });
  });
});
