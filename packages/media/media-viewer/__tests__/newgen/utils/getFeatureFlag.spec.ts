import { getFeatureFlag } from '../../../src/newgen/utils/getFeatureFlag';

describe('getFeatureFlag', () => {
  const nativeLocalStorage = window.localStorage;

  afterEach(() => {
    (window as any).localStorage = nativeLocalStorage;
  });

  it('should return the value if its present in the passed features flags', () => {
    expect(getFeatureFlag('nextGen', { nextGen: true })).toBeTruthy();
    expect(getFeatureFlag('nextGen', { nextGen: false })).toBeFalsy();
  });

  it('should use localStorage if flag is not passed', () => {
    expect(getFeatureFlag('customVideoPlayer', { nextGen: true })).toBeFalsy();

    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenCustomVideoPlayer') {
          return 'true';
        }
        return null;
      },
    };

    expect(getFeatureFlag('customVideoPlayer')).toBeTruthy();
    expect(getFeatureFlag('customVideoPlayer', { nextGen: true })).toBeTruthy();
    expect(getFeatureFlag('nextGen')).toBeFalsy();
  });

  it('should return true if flag is false and dev override is true', () => {
    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenEnabled') {
          return 'true';
        }
        return null;
      },
    };
    expect(
      getFeatureFlag('nextGen', {
        nextGen: false,
      }),
    ).toBeTruthy();
  });

  it('should return false if flag is true and dev override is false', () => {
    (window as any).localStorage = {
      getItem(item: string) {
        if (item === 'MediaViewerNextGenEnabled') {
          return 'false';
        }
        return null;
      },
    };
    expect(
      getFeatureFlag('nextGen', {
        nextGen: true,
      }),
    ).toBeFalsy();
  });
});
