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
      return req.url().path === '/file/copy/withToken';
    },
    function(req) {
      return (
        req.body() &&
        /[a-z0-9\-]+/.test(JSON.parse(req.body()).sourceFile.id) &&
        JSON.parse(req.body()).sourceFile.collection === 'recents'
      );
    },
  ].reduce((res, fn) => res && fn(req), true);
}

module.exports = { getNext, matchesRequest };
responseArray.push(
  /**
   * POST /file/copy/withToken
   *
   * host: dt-api--app.ap-southeast-2.dev.atl-paas.net
   * connection: keep-alive
   * content-length: 309
   * accept: application/json, text/plain, * / *
   * x-client-id: 870431f7-a507-4480-907b-90a1eebb64a5
   * authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bnNhZmUiOnRydWUsImlzcyI6Ijg3MDQzMWY3LWE1MDctNDQ4MC05MDdiLTkwYTFlZWJiNjRhNSJ9.hjkpyjQZlUdQAVgY4GKKdQEzY-W0duSvNS86Ryvz5yw
   * user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36
   * origin: http://localhost:8081
   * content-type: application/json; charset=UTF-8
   * referer: http://localhost:8081/example/basic.html
   * accept-encoding: gzip, deflate, br
   * accept-language: en-GB,en-US;q=0.9,en;q=0.8
   */

  function(req, res) {
    res.status(201);

    res.header('date', 'Wed, 03 Jan 2018 02:26:22 GMT');
    res.header('content-type', 'application/json');
    res.header('content-length', '951');
    res.header('connection', 'keep-alive');
    res.header('server', 'nginx/1.10.1');
    res.header('access-control-allow-origin', '*');
    res.header(
      'access-control-expose-headers',
      'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
    );
    res.header('x-b3-spanid', '3ab94ef3d31f0214');
    res.header('x-b3-traceid', '3ab94ef3d31f0214');

    res.body(`{
      "data": {
        "mediaType": "image",
        "mimeType": "image/jpeg",
        "name": "mark-atlassian-B400.jpg",
        "size": 79725,
        "processingStatus": "succeeded",
        "artifacts": {
          "meta.json": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/meta.json/binary",
            "processingStatus": "succeeded"
          },
          "thumb_120.jpg": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/thumb_120.jpg/binary",
            "processingStatus": "succeeded"
          },
          "thumb.jpg": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/thumb_120.jpg/binary",
            "processingStatus": "succeeded"
          },
          "image.jpg": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/image.jpg/binary",
            "processingStatus": "succeeded"
          },
          "thumb_320.jpg": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/thumb_320.jpg/binary",
            "processingStatus": "succeeded"
          },
          "thumb_large.jpg": {
            "url": "/file/8821f924-c9b6-4a12-8fe8-4ed0d842a877/artifact/thumb_320.jpg/binary",
            "processingStatus": "succeeded"
          }
        },
        "id": "8821f924-c9b6-4a12-8fe8-4ed0d842a877"
      }
    }`);

    return res;
  },
);
