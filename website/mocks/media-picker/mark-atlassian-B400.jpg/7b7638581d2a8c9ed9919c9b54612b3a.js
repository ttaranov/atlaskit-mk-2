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
      return req.method() === 'GET';
    },
    function(req) {
      return req.url().path === '/picker/accounts';
    },
  ].reduce((res, fn) => res && fn(req), true);
}

module.exports = { getNext, matchesRequest };
responseArray.push(
  /**
   * GET /picker/accounts
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * accept: application/json, text/plain, * / *
   * x-client-id: 870431f7-a507-4480-907b-90a1eebb64a5
   * authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(404);

    res.header('date', 'Wed, 03 Jan 2018 02:26:17 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '103');
    res.header('connection', 'keep-alive');
    res.header('server', 'nginx/1.10.1');
    res.header('x-b3-traceid', '6de28880e3774815');
    res.header('x-b3-spanid', '6de28880e3774815');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges,Content-Encoding,Content-Length,Content-Range',
    );
    res.header('x-dns-prefetch-control', 'off');
    res.header('x-frame-options', 'SAMEORIGIN');
    res.header(
      'strict-transport-security',
      'max-age=15552000; includeSubDomains',
    );
    res.header('x-download-options', 'noopen');
    res.header('x-content-type-options', 'nosniff');
    res.header('x-xss-protection', '1; mode=block');

    res.body(`{
      "data": [
        {
          "type": "dropbox",
          "status": "available",
          "accounts": []
        },
        {
          "type": "google",
          "status": "available",
          "accounts": [
            {
              "id": "e701b444e4f5e305b19cc7677a95faaf0794ff0125ec63a49f582299b618c68a8971bcd78a02ee0018223045e53576720e79d0772fe3c8aa3ecb4f26845795b7",
              "status": "available",
              "displayName": "vvlasov@atlassian.com",
              "email": "vvlasov@atlassian.com"
            }
          ]
        }
      ]
    }`);

    return res;
  },
);
