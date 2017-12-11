import { mockMessageService } from '../mocks';
import { AuthServiceImpl } from '../../../src/popup/services/auth-service';

describe('AuthServiceImpl', () => {
  const context = {
    collectionName: 'some-collection-name',
  };
  const setup = () => {
    const messageService = mockMessageService();
    const authService = new AuthServiceImpl(messageService);

    return {
      messageService,
      authService,
    };
  };

  it('should send getUserAuth message when requesting user auth', () => {
    const { messageService, authService } = setup();

    authService.getUserAuth();

    expect(messageService.post).toBeCalledWith({ type: 'getUserAuth' });
  });

  it('should send getUserAuth message when requesting user auth given context', () => {
    const { messageService, authService } = setup();

    authService.getUserAuth(context);

    expect(messageService.post).toBeCalledWith({
      type: 'getUserAuth',
      payload: context,
    });
  });

  it('should send getTenantAuth message when requesting tenant auth', () => {
    const { messageService, authService } = setup();

    authService.getTenantAuth();

    expect(messageService.post).toBeCalledWith({ type: 'getTenantAuth' });
  });

  it('should send getTenantAuth message when requesting tenant auth given context', () => {
    const { messageService, authService } = setup();

    authService.getTenantAuth(context);

    expect(messageService.post).toBeCalledWith({
      type: 'getTenantAuth',
      payload: context,
    });
  });
});
