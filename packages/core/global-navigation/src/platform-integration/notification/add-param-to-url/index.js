// @flow

import UrlParse from 'url-parse';

export default (url: string, key: string, value: string) => {
  const parsedUrl = UrlParse(url);
  const seperator = parsedUrl.query.length ? '&' : '?';
  parsedUrl.set(
    'query',
    `${parsedUrl.query}${seperator}${key}=${encodeURIComponent(value)}`,
  );
  return parsedUrl.href;
};
