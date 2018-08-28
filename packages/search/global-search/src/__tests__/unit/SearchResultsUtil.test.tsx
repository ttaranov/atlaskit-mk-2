import { handlePromiseError } from '../../components/SearchResultsUtil';

describe('handlePromiseError', () => {
  it('should do nothing when promise is resolved', () => {
    const promiseValue = 10;
    const promise = Promise.resolve(promiseValue);
    const errorHandlerMock = jest.fn();
    const defaultValue = 80;

    return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
      value => {
        expect(value).toBe(promiseValue);
        expect(errorHandlerMock.mock.calls.length).toBe(0);
      },
    );
  });

  it('should use default value when promise is rejected', () => {
    const promise = Promise.reject(new Error('err'));
    const errorHandlerMock = jest.fn();
    const defaultValue = 80;
    // @ts-ignore
    return handlePromiseError(promise, defaultValue, errorHandlerMock).then(
      value => {
        expect(value).toBe(defaultValue);
        expect(errorHandlerMock.mock.calls.length).toBe(1);
      },
    );
  });

  it('should not throw exception', () => {
    const promise = Promise.reject(new Error('err'));
    const errorHandlerMock = () => {
      throw new Error('new error');
    };
    const defaultValue = 80;
    // @ts-ignore
    return handlePromiseError(promise, defaultValue, errorHandlerMock)
      .then(value => {
        expect(value).toBe(defaultValue);
      })
      .catch(error => {
        throw new Error(
          'should never throw exception and never reach the catch block',
        );
      });
  });
});
