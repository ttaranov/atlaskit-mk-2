import { Auth, AuthContext, AuthProvider } from '@atlaskit/media-core';
import { MessageService } from '../../service/messageService';

export interface AuthService {
  readonly getUserAuth: AuthProvider;
  readonly getTenantAuth: AuthProvider;
}

export class AuthServiceImpl {
  constructor(private readonly messageService: MessageService) {}

  getUserAuth = (context?: AuthContext): Promise<Auth> => {
    return this.messageService.post<AuthContext | undefined, Auth>({
      type: 'getUserAuth',
      payload: context,
    });
  };

  getTenantAuth = (context?: AuthContext): Promise<Auth> => {
    return this.messageService.post<AuthContext | undefined, Auth>({
      type: 'getTenantAuth',
      payload: context,
    });
  };
}
