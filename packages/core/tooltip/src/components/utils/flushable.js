// @flow

/*
* Creates a state machine that represents a pending action. If needed, the action
* can be executed immediately by flushing.
*
* By default the action is executed after the delay time period:
*
*            time === delay
* pending ------------------> onComplete()
*
* Or if flush() is called before delay time period:
*
*            time <= delay
* pending -------> onFlush()
*/
const flushable = (
  onComplete: () => any,
  delay: number,
  onFlush: () => any,
) => {
  let pending = true;
  const timeoutId = setTimeout(() => {
    pending = false;
    onComplete();
  }, delay);
  return {
    flush: () => {
      if (pending) {
        clearTimeout(timeoutId);
        pending = false;
        onFlush();
      }
    },
    pending: () => pending,
    timeoutID: () => timeoutId,
  };
};

export default flushable;
