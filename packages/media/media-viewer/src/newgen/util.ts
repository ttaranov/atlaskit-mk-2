import { Context, isClientBasedAuth } from '@atlaskit/media-core';
import { stringify } from 'query-string';

export async function addAuthTokenToUrl(url: string, context: Context, collectionName?: string): Promise<string> {
  const host = context.config.serviceHost;
  const auth = await context.config.authProvider({ collectionName });
  let query = {} as any;
  if (isClientBasedAuth(auth)) {
    query.client = auth.clientId;
  } else {
    query.issuer = auth.asapIssuer;
  }
  query.collection = collectionName;
  query.token = auth.token;

  return `${host}${url}?${stringify(query)}`;
}
