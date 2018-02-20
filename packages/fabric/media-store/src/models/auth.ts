export interface ClientBasedAuth {
  readonly clientId: string;
  readonly token: string;
}

export interface AsapBasedAuth {
  readonly asapIssuer: string;
  readonly token: string;
}

export type Auth = ClientBasedAuth | AsapBasedAuth;

export function isClientBasedAuth(auth: Auth): auth is ClientBasedAuth {
  return !!(auth as ClientBasedAuth).clientId;
}

export function isAsapBasedAuth(auth: Auth): auth is AsapBasedAuth {
  return !!(auth as AsapBasedAuth).asapIssuer;
}
