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
      return req.url().path === '/token/user/impersonation';
    },
  ].reduce((res, fn) => res && fn(req), true);
}

module.exports = { getNext, matchesRequest };
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
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnREZXRhaWxzIjp7ImNsaWVudFR5cGUiOiJ1c2VyIiwidXNlcklkIjoiNjU1MzYyOmI5ZTBlMGI1LWM2MzktNGZjYi05NmYyLTA2ZmU2YWU3OTRiZSIsInVzZXJJZFR5cGUiOiJhaWQifSwiYWNjZXNzIjp7InVybjpmaWxlc3RvcmU6Y29sbGVjdGlvbjpyZWNlbnRzIjpbInVwZGF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTpjaHVuazoqIjpbImNyZWF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTp1cGxvYWQiOlsiY3JlYXRlIl0sInVybjpmaWxlc3RvcmU6dXBsb2FkOioiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSJdfSwibmJmIjoxNTE2MDUxMjY4LCJleHAiOjE1MTYwNTQ4NjgsImlhdCI6MTUxNjA1MTMyOCwiaXNzIjoiODY2YWY4YTYtN2Q2ZC00NThlLTg0ZmItYTFlNDRmNjQ4ZmVjIn0.KsDOHbPqzOj7InuessksrIih7SbvQj2ULxUZfArKc1w",
      "clientId": "866af8a6-7d6d-458e-84fb-a1e44f648fec"
    }`);

    return res;
  },
);
