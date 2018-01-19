const responseArray = <any>[];
let callIndex = 0;

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
      return req.method() === 'HEAD';
    },
    function(req) {
      return (
        req.url().path ===
        '/chunk/cd69284731c5a6da0d22d635eeb1c06057582c7f-79725'
      );
    },
  ].reduce((res, fn) => res && fn(req), true);
}

responseArray.push(
  /**
   * HEAD /chunk/cd69284731c5a6da0d22d635eeb1c06057582c7f-79725?client=870431f7-a507-4480-907b-90a1eebb64a5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * accept: * / *
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(200);

    res.header('date', 'Wed, 03 Jan 2018 02:26:17 GMT');
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
    res.header('x-b3-spanid', 'b57fd864d6440bc8');
    res.header('x-b3-traceid', 'b57fd864d6440bc8');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-dns-prefetch-control', 'off');
    res.header('x-download-options', 'noopen');
    res.header('x-frame-options', 'SAMEORIGIN');
    res.header('x-xss-protection', '1; mode=block');

    return res;
  },
);
