import { AuthProvider, Auth, isClientBasedAuth } from '@atlaskit/media-core';
import * as $ from 'jquery';
import { parse, stringify } from 'query-string';

import { MediaFile, MediaFileAttributes } from '../mediaviewer';

export const fetchToken = (
  authProvider: AuthProvider,
  collectionName?: string,
) => ({ attributes }: MediaFile) => {
  const deferred = $.Deferred<MediaFileAttributes>();
  authProvider({ collectionName })
    .then((auth: Auth) => {
      deferred.resolve({
        src: refreshAuthentication(attributes.src, auth, collectionName) || '',
        srcDownload:
          refreshAuthentication(attributes.srcDownload, auth, collectionName) ||
          '',
        src_hd: refreshAuthentication(attributes.src_hd, auth, collectionName),
        poster: refreshAuthentication(attributes.poster, auth, collectionName),
      });
    })
    .catch(deferred.reject);

  return deferred.promise();
};

function refreshAuthentication(
  url: string | undefined,
  auth: Auth,
  collectionName: string | undefined,
): string | undefined {
  if (url) {
    const { urlWithoutQueryString, queryString } = split(url);
    return `${urlWithoutQueryString}?${refreshQueryString(
      queryString,
      auth,
      collectionName,
    )}`;
  }

  return undefined;
}

function refreshQueryString(
  queryString: string | undefined,
  auth: Auth,
  collectionName: string | undefined,
): string {
  let query = {} as any;

  if (queryString) {
    query = parse(queryString);
  }

  if (isClientBasedAuth(auth)) {
    query.client = auth.clientId;
  } else {
    query.issuer = auth.asapIssuer;
  }
  query.collection = collectionName;
  query.token = auth.token;

  return stringify(query);
}

function split(
  url: string,
): { urlWithoutQueryString: string; queryString?: string } {
  const index = url.indexOf('?');

  if (index > 0) {
    return {
      urlWithoutQueryString: url.substring(0, index),
      queryString: url.substring(index + 1, url.length),
    };
  } else {
    return {
      urlWithoutQueryString: url,
    };
  }
}
