import service from './service';

/**
 * Returns a sequence of tracking analytics event and the provided function.
 *
 * Usage:
 *
 *     let doSomething = function(a, b) { // ... }
 *     doSomething = trackAndInvoke('atlassian.editor.dosomething', doSomething);
 *
 *     doSomething(); // this will send analytics event and call the original function
 *
 */
export default function trackAndInvoke<S, D, E, R>(
  analyticsEventName: string,
  fn: (state: S, dispatch: D, view?: E) => R,
) {
  return function(state: S, dispatch: D, view?: E): R {
    const result = fn(state, dispatch, view);
    if (result) {
      service.trackEvent(analyticsEventName);
    }
    return result;
  };
}
