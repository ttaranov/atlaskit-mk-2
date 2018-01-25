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
      return req.method() === 'POST';
    },
    function(req) {
      return (
        req.url().path === '/token' &&
        req.url().query.collection === 'MediaServicesSample'
      );
    },
  ].reduce((res, fn) => res && fn(req), true);
}

responseArray.push(
  /**
   * POST /client
   *
   * content-type: application/json
   * content-length: 41
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: close
   */

  function(req, res) {
    res.status(200);

    res.header('date', 'Wed, 03 Jan 2018 02:26:15 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '259');
    res.header('connection', 'close');
    res.header('server', 'nginx/1.10.1');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
    );
    res.header('x-b3-spanid', 'b534dde1f88b92a5');
    res.header('x-b3-traceid', 'b534dde1f88b92a5');

    res.body(`{
      "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTUzNjI6YjllMGUwYjUtYzYzOS00ZmNiLTk2ZjItMDZmZTZhZTc5NGJlIiwiYWNjZXNzIjp7InVybjpmaWxlc3RvcmU6Y29sbGVjdGlvbjpNZWRpYVNlcnZpY2VzU2FtcGxlIjpbInJlYWQiLCJpbnNlcnQiXSwidXJuOmZpbGVzdG9yZTpjaHVuazoqIjpbImNyZWF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTp1cGxvYWQiOlsiY3JlYXRlIl0sInVybjpmaWxlc3RvcmU6dXBsb2FkOioiOlsicmVhZCIsInVwZGF0ZSJdfSwibmJmIjoxNTE2NzQ4MjcxLCJleHAiOjE1MTY3NTE4NzEsImlhdCI6MTUxNjc0ODMzMSwiaXNzIjoiNWE5ODEyZmMtZDAyOS00YTM5LThhNDYtZDNjYzM2ZWVkN2FiIn0.58X81_q6QfcG5WhJcX4jYaY5Mz60am4c0wAxSh6go8c",
      "clientId":"5a9812fc-d029-4a39-8a46-d3cc36eed7ab"
    }`);

    return res;
  },
);
