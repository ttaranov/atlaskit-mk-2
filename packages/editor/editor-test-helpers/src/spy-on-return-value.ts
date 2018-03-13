export type spyWithReturnValue = jest.SpyInstance<any> & { returnValue?: any };

/**
 * Returns a jest function spy, which also captures the last return value of the target
 * method. This replaces Sinon's syntax: sinon.stub(obj, 'method').returns(val);
 *
 * Example Usage:
 *
 *    const spy = spyOnReturnValue(someObject, 'runMe');
 *    expect(spy).toHaveBeenCalled();
 *    expect(spy.returnValue).toBe(true);
 *
 * @param string object The object instance to use.
 * @param string methodName The method name on the object to spy on.
 * @param {jest-sandbox} sandbox (optional) Jest sandbox instance to use
 */
export default function spyOnReturnValue(
  object: any,
  methodName: string,
  sandbox?: typeof jest,
) {
  const originalFn = object[methodName];
  let spy: spyWithReturnValue;

  if (sandbox) {
    sandbox = jest;
    spy = sandbox.spyOn(object, methodName);
  } else {
    spy = jest.spyOn(object, methodName);

    afterEach(() => {
      spy.mockRestore();
    });
  }

  spy.mockImplementation(
    (...args) => (spy.returnValue = originalFn.apply(object, args)),
  );

  return spy;
}
