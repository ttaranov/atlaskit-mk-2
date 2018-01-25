import mock, { proxy } from 'xhr-mock';
import modules from './mocks/media-picker/mark-atlassian-B400.jpg/**/*.ts';

export const enableMock = () => {
  console.log(`MOCKING HTTP REQUESTS!!!`);

  mock.setup();

  // this request will be mocked
  mock.use((req, res) => {
    const mod = modules.find(module => module.matchesRequest(req));
    if (mod) {
      console.log(`Matched request ${JSON.stringify(req, null, 2)}`);
      mod.getNext()(req, res);
      console.log(`Sending response ${JSON.stringify(res, null, 2)}`);
      return res;
    } else {
      // proxy unhandled requests to the real servers
      return proxy(req, res).then(res => {
        console.log(
          `Unmatched request ${JSON.stringify(
            req,
            null,
            2,
          )}\nProxying to real xhr`,
        );
        console.log(`Got real response ${JSON.stringify(res, null, 2)}`);
        return res;
      });
    }
  });
};

export const disableMock = () => {
  mock.teardown();
  console.log("Oy-vey, you're leaving already?");
};
