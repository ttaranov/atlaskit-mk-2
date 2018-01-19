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
      return req.url().path === '/token/tenant';
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
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpjb2xsZWN0aW9uIjpbImNyZWF0ZSJdLCJ1cm46ZmlsZXN0b3JlOmNvbGxlY3Rpb246bWVkaWFwaWNrZXItdGVzdCI6WyJyZWFkIiwiaW5zZXJ0Il0sInVybjpmaWxlc3RvcmU6Y2h1bms6KiI6WyJjcmVhdGUiLCJyZWFkIl0sInVybjpmaWxlc3RvcmU6dXBsb2FkIjpbImNyZWF0ZSJdLCJ1cm46ZmlsZXN0b3JlOnVwbG9hZDoqIjpbInJlYWQiLCJ1cGRhdGUiXX0sIm5iZiI6MTUxNjA1MTc3MiwiZXhwIjoxNTE2MDU1MzcyLCJpYXQiOjE1MTYwNTE4MzIsImlzcyI6IjVhOTgxMmZjLWQwMjktNGEzOS04YTQ2LWQzY2MzNmVlZDdhYiJ9.13TynAlMY5Y4Dmj1vcEXtEgETnedRtda6r8HhugcEr8",
      "clientId": "5a9812fc-d029-4a39-8a46-d3cc36eed7ab"
    }`);

    return res;
  },
);
