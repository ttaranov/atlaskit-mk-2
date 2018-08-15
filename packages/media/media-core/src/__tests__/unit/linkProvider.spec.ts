import { LinkItem } from '../../item';
import { LinkProvider } from '../../providers/linkProvider';

const linkId = 'some-link-id';
const collection = 'some-collection';
const someLinkItem = <LinkItem>{
  type: 'link',
  details: {
    id: linkId,
    url: 'some-url',
  },
};
const mockObserver = () => {
  return {
    next: jest.fn(),
    complete: jest.fn(),
    error: jest.fn(),
  };
};

describe('LinkProvider', () => {
  it('should complete given link service resolves a link item', () => {
    const linkService = Mocks.linkServiceResolves();
    const linkProvider = LinkProvider.fromLinkService(
      linkService,
      linkId,
      collection,
    ).observable();
    const observer = mockObserver();

    linkProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      linkProvider.subscribe({
        complete: () => {
          try {
            expect(observer.next).toHaveBeenCalledWith(someLinkItem);
            expect(observer.complete).toHaveBeenCalledWith();
            expect(observer.error).not.toHaveBeenCalled();
          } catch (err) {
            reject(err);
            return;
          }
          resolve();
        },
      });
    });
  });

  it('should error given link service rejects with an error', () => {
    const linkService = Mocks.linkServiceError();
    const linkProvider = LinkProvider.fromLinkService(
      linkService,
      linkId,
      collection,
    ).observable();
    const observer = mockObserver();

    linkProvider.subscribe(observer);

    return new Promise((resolve, reject) => {
      linkProvider.subscribe({
        error: error => {
          try {
            expect(observer.next).not.toHaveBeenCalled();
            expect(observer.complete).not.toHaveBeenCalled();
            expect(observer.error).toHaveBeenCalledWith(error);
          } catch (err) {
            reject(err);
            return;
          }
          resolve();
        },
      });
    });
  });
});

class Mocks {
  public static linkServiceResolves() {
    const getLinkStub = jest.fn(() => Promise.resolve(someLinkItem));
    const addLinkStub = jest.fn(() => Promise.resolve(linkId));

    return {
      getLinkItem: getLinkStub,
      addLinkItem: addLinkStub,
    };
  }

  public static linkServiceError() {
    const stub = jest.fn(() => Promise.reject(new Error('mock-error')));

    return {
      getLinkItem: stub,
      addLinkItem: stub,
    };
  }
}
