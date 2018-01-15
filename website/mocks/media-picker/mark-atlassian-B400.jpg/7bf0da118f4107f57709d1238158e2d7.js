var responseArray = [];
var callIndex = 0;

function getNext() {
  const fn = responseArray[callIndex];
  callIndex += 1;
  if (callIndex === responseArray.length) {
    callIndex = 0;
  }
  return fn;
}

function matchesRequest(req) {
  return [
    function(req) {
      return req.method() === 'POST';
    },
    function(req) {
      return req.url().path === '/upload' && req.url().query.createUpTo === '1';
    },
  ].reduce((res, fn) => res && fn(req), true);
}

module.exports = { getNext, matchesRequest };
responseArray.push(
  /**
   * POST /upload?createUpTo=1&safariCacheBuster=a307a402-ed87-4e07-9071-80ae4d1af419&client=870431f7-a507-4480-907b-90a1eebb64a5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * content-length: 0
   * accept: application/json, text/plain, * / *
   * origin: http://localhost:8081
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(201);

    res.header('date', 'Wed, 03 Jan 2018 02:26:19 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '98');
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
    res.header('x-b3-spanid', 'bdc644cf35936741');
    res.header('x-b3-traceid', 'bdc644cf35936741');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-dns-prefetch-control', 'off');
    res.header('x-download-options', 'noopen');
    res.header('x-frame-options', 'SAMEORIGIN');
    res.header('x-xss-protection', '1; mode=block');

    res.body(
      new Buffer(
        'eyJkYXRhIjpbeyJpZCI6IjliM2Y0NzFmLTlhMjEtNGQxMy04OGZmLTIzZDJkOGM4MDM5NyIsImNyZWF0ZWQiOjE1MTQ5NDYzNzksImV4cGlyZXMiOjE1MTUwMzI3Nzl9XX0=',
        'base64',
      ).toString(),
    );

    return res;
  },
);
