import getStaticAssetUrl from '../../src/util/getStaticAssetUrl';

describe('getStaticAssetUrl', () => {
  const partialConfig = {
    baseUrl: 'some-base-url',
    version: 1.2,
    html: {
      redirectUrl: 'some-redirect-url',
    },
  };

  it('should return redirect url given redirect asset alias not using versions', () => {
    expect(
      getStaticAssetUrl(
        {
          ...partialConfig,
          usingVersions: false,
        },
        'redirectUrl',
      ),
    ).toEqual('some-base-url/some-redirect-url');
  });

  it('should return redirect url given redirect asset alias using versions', () => {
    expect(
      getStaticAssetUrl(
        {
          ...partialConfig,
          usingVersions: true,
        },
        'redirectUrl',
      ),
    ).toEqual('some-base-url/1.2/some-redirect-url');
  });
});
