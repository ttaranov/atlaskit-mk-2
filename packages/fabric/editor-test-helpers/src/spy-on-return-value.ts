export type spyWithReturnValue = jest.SpyInstance<any> & { returnValue: any };

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
 */
export default function spyOnReturnValue(object: any, methodName: string) {
  const originalFn = object[methodName];
  const spy = jest.spyOn(object, methodName) as spyWithReturnValue;
  spy.mockImplementation((...args) =>
    spy.returnValue = originalFn.apply(this, args)
  );

  afterEach(() => {
    spy.mockRestore();
  });

  return spy;
};
