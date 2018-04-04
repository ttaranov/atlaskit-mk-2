import { Context, isClientBasedAuth } from '@atlaskit/media-core';
import { stringify } from 'query-string';
import { Identifier, File } from './domain';

export const sameIdentifier = (a: Identifier, b: Identifier): boolean => {
  return a.id === b.id && a.occurrenceKey === b.occurrenceKey && a.type === b.type;
}

export const leftItems = (items: Identifier[], selected: Identifier): File[] => {
  return this.leftIdentifiers(items, selected).map(this.toPendingFile);
}

export const leftIdentifiers = (items: Identifier[], selected: Identifier): Identifier[] => {
  const index = items.findIndex(i => sameIdentifier(i, selected));
  if (index > -1) {
    return items.slice(0, index);
  } else {
    return [];
  }
}

export const rightItems = (items: Identifier[], selected: Identifier): File[] => {
  return this.rightIdentifiers(items, selected).map(this.toPendingFile);
}

export const rightIdentifiers = (items: Identifier[], selected: Identifier): Identifier[] => {
  const index = items.findIndex(i => sameIdentifier(i, selected));
  if (index > -1) {
    return items.slice(index + 1, items.length);
  } else {
    return [];
  }
}

export const toPendingFile = (identifier: Identifier): File => {
  return {
    identifier,
    fileDetails: {
      status: 'PENDING'
    },
    filePreview: {
      status: 'PENDING'
    }
  }
}

export async function constructAuthTokenUrl(
  url: string,
  context: Context,
  collectionName?: string,
): Promise<string> {
  const host = context.config.serviceHost;
  const auth = await context.config.authProvider({ collectionName });
  if (isClientBasedAuth(auth)) {
    return buildClientBasedUrl(
      host,
      url,
      auth.token,
      auth.clientId,
      collectionName,
    );
  } else {
    return buildIssuerBasedUrl(
      host,
      url,
      auth.token,
      auth.asapIssuer,
      collectionName,
    );
  }
}

function buildClientBasedUrl(
  host: string,
  url: string,
  token: string,
  client: string,
  collection?: string,
): string {
  return buildUrl(host, url, { client, collection, token });
}

function buildIssuerBasedUrl(
  host: string,
  url: string,
  token: string,
  issuer: string,
  collection?: string,
): string {
  return buildUrl(host, url, { issuer, collection, token });
}

function buildUrl(host: string, url: string, query: Object) {
  return `${host}${url}?${stringify(query)}`;
}
