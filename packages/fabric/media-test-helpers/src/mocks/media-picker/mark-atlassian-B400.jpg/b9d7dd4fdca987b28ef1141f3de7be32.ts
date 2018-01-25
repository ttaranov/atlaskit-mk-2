const responseArray = <any>[];
let callIndex = 0;
let fileId;

export function getNext() {
  const fn = responseArray[callIndex];
  callIndex += 1;
  if (callIndex === responseArray.length) {
    callIndex = 0;
  }
  return fn;
}

export function matchesRequest(req) {
  return [
    function(req) {
      return req.method() === 'GET';
    },
    function(req) {
      return (function() {
        if (
          /\/file\/([a-z0-9\-]+)/.test(req.url().path) &&
          req.url().query.collection === 'recents'
        ) {
          const match = /\/file\/([a-z0-9\-]+)/.exec(req.url().path);
          fileId = match !== null ? match[1] : '';
          return true;
        }
        return false;
      })();
    },
  ].reduce((res, fn) => res && fn(req), true);
}

responseArray.push(
  /**
   * GET /file/${fileId}?collection=recents&client=870431f7-a507-4480-907b-90a1eebb64a5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * accept: application/json, text/plain, * / *
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(200);

    res.header('date', 'Wed, 03 Jan 2018 02:26:20 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '190');
    res.header('connection', 'keep-alive');
    res.header('server', 'nginx/1.10.1');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
    );
    res.header(
      'strict-transport-security',
      'max-age=15552000; includeSubDomains',
    );
    res.header('x-b3-spanid', '9f904ea5395d1118');
    res.header('x-b3-traceid', '9f904ea5395d1118');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-dns-prefetch-control', 'off');
    res.header('x-download-options', 'noopen');
    res.header('x-frame-options', 'SAMEORIGIN');
    res.header('x-xss-protection', '1; mode=block');

    res.body(
      `{"data":{"mediaType":"unknown","mimeType":"image/jpeg","name":"mark-atlassian-B400.jpg","size":79725,"processingStatus":"pending","artifacts":{},"id":"${fileId}"}}`,
    );

    return res;
  },
);
responseArray.push(
  /**
   * GET /file/${fileId}?collection=recents&client=870431f7-a507-4480-907b-90a1eebb64a5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * accept: application/json, text/plain, * / *
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(200);

    res.header('date', 'Wed, 03 Jan 2018 02:26:21 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '951');
    res.header('connection', 'keep-alive');
    res.header('server', 'nginx/1.10.1');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
    );
    res.header(
      'strict-transport-security',
      'max-age=15552000; includeSubDomains',
    );
    res.header('x-b3-spanid', 'a0b13953e607a2c7');
    res.header('x-b3-traceid', 'a0b13953e607a2c7');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-dns-prefetch-control', 'off');
    res.header('x-download-options', 'noopen');
    res.header('x-frame-options', 'SAMEORIGIN');
    res.header('x-xss-protection', '1; mode=block');

    res.body(
      `{"data":{"mediaType":"image","mimeType":"image/jpeg","name":"mark-atlassian-B400.jpg","size":79725,"processingStatus":"succeeded","artifacts":{"image.jpg":{"url":"/file/${fileId}/artifact/image.jpg/binary","processingStatus":"succeeded"},"meta.json":{"url":"/file/${fileId}/artifact/meta.json/binary","processingStatus":"succeeded"},"thumb_120.jpg":{"url":"/file/${fileId}/artifact/thumb_120.jpg/binary","processingStatus":"succeeded"},"thumb.jpg":{"url":"/file/${fileId}/artifact/thumb_120.jpg/binary","processingStatus":"succeeded"},"thumb_320.jpg":{"url":"/file/${fileId}/artifact/thumb_320.jpg/binary","processingStatus":"succeeded"},"thumb_large.jpg":{"url":"/file/${fileId}/artifact/thumb_320.jpg/binary","processingStatus":"succeeded"}},"id":"${fileId}"}}`,
    );

    return res;
  },
);
