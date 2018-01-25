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
      return req.method() === 'GET';
    },
    function(req) {
      return (
        req.url().path === '/collection/recents/items' &&
        req.url().query.sortDirection === 'desc' &&
        req.url().query.limit === '30'
      );
    },
  ].reduce((res, fn) => res && fn(req), true);
}

responseArray.push(
  /**
   * GET /collection/recents/items?sortDirection=desc&limit=30
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
    res.status(200);

    res.header('date', 'Wed, 03 Jan 2018 02:26:17 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '155');
    res.header('connection', 'keep-alive');
    res.header('server', 'nginx/1.10.1');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
    );
    res.header('x-b3-spanid', 'e01c8634a7dd93de');
    res.header('x-b3-traceid', 'e01c8634a7dd93de');

    res.body(`{
      "data": {
        "nextInclusiveStartKey": "0",
        "contents": []
      }
    }`);

    return res;
  },
);
