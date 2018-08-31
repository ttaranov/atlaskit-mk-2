import analytics from '../../../analytics/decorator';
import { AnalyticsHandler } from '../../../analytics/handler';
import service from '../../../analytics/service';

describe('analytics decorator', () => {
  let spy: any;

  beforeEach(() => {
    spy = jest.fn();
    service.handler = spy as AnalyticsHandler;
  });

  afterEach(() => {
    spy = null;
    service.handler = null;
  });

  it('tracks events after class method is called', () => {
    class AnnotatedTestClass {
      @analytics('test.event')
      foo() {
        return true;
      }
    }

    const instance = new AnnotatedTestClass();
    expect(spy).not.toHaveBeenCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledWith('test.event');
    expect(spy).toHaveBeenCalledTimes(1);

    instance.foo();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event');
  });

  it('tracks events after bound method (instance property) is called', () => {
    class AnnotatedTestClass2 {
      @analytics('test.event.foo') foo = () => true;

      @analytics('test.event.bar') bar = () => true;
    }

    const instance = new AnnotatedTestClass2();
    expect(spy).not.toHaveBeenCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledWith('test.event.foo');
    expect(spy).toHaveBeenCalledTimes(1);

    instance.bar();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event.bar');
  });

  it('returns unique decorated bound method (property) per instance', () => {
    class AnnotatedTestClassWithBoundMethod {
      @analytics('test.event.foo') foo = () => true;
    }

    const instance1 = new AnnotatedTestClassWithBoundMethod();
    const instance2 = new AnnotatedTestClassWithBoundMethod();

    expect(instance1.foo).not.toBe(instance2.foo);
  });

  it('returns property value if decorating a non-function property', () => {
    const spy = jest.spyOn(console, 'warn');
    spy.mockImplementation(() => {});

    class AnnotatedTestClassWithPrimitiveValue {
      @analytics('test.event.foo') foo = 15.15;
    }

    const instance = new AnnotatedTestClassWithPrimitiveValue();

    expect(spy).toHaveBeenCalled();
    expect(instance.foo).toEqual(15.15);
    spy.mockRestore();
  });

  it('can track private methods being called', () => {
    class AnnotatedTestClass3 {
      @analytics('test.event.foo')
      foo = () => {
        this.bar();
        return true;
      };

      @analytics('test.event.bar') private bar = () => true;
    }

    const instance = new AnnotatedTestClass3();
    expect(spy).not.toBeCalled();

    instance.foo();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('test.event.foo');
    expect(spy).toHaveBeenCalledWith('test.event.bar');
  });

  it('should not track event if it returns false', () => {
    class AnnotatedTestClass {
      @analytics('test.event.foo') foo = () => false;
    }

    const instance = new AnnotatedTestClass();
    expect(spy).not.toBeCalled();

    instance.foo();
    expect(spy).not.toBeCalled();
  });
});
