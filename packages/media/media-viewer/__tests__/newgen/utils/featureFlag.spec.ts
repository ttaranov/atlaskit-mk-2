import { getFeatureFlag } from '../../../src/newgen/utils/featureFlag';

describe('getFeatureFlag', () => {
  it('should return the value if its present in the passed features flags', () => {
    expect(getFeatureFlag('nextGen', { nextGen: true })).toBeTruthy();
    expect(getFeatureFlag('nextGen', { nextGen: false })).toBeFalsy();
  });

  it('should use localStorage if flag is not passed', () => {
    const nativeLocalStorage = window.localStorage;

    expect(getFeatureFlag('customVideoPlayer', { nextGen: true })).toBeFalsy();

    (window as any).localStorage = {
      getItem(item) {
        if (item === 'MediaViewerNextGenCustomVideoPlayer') return true;
      },
    };

    expect(getFeatureFlag('customVideoPlayer')).toBeTruthy();
    expect(getFeatureFlag('customVideoPlayer', { nextGen: true })).toBeTruthy();
    expect(getFeatureFlag('nextGen')).toBeFalsy();

    (window as any).localStorage = nativeLocalStorage;
  });
});
