// @flow

/*
* Creates a state machine that represents a pending action. The action can be
* executed immediately by flushing. The action can also be cancelled.
*
* By default the action is executed after the delay time period:
*
*            time === delay
* pending ------------------> onComplete(false)
*
* Or if flush() is called before delay time period:
*
*            time <= delay
* pending -------> onComplete(true)
*
* Or if cancel() is called before delay time period:
*
*            time <= delay
* pending -------x
*/
const flushable = (onComplete: (flushed: boolean) => any, delay: number) => {
  let timeoutId = setTimeout(() => {
    timeoutId = null;
    onComplete(false);
  }, delay);
  const clearTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return {
    cancel: clearTimer,
    flush: () => {
      if (!timeoutId) {
        return;
      }
      clearTimer();
      onComplete(true);
    },
    pending: () => Boolean(timeoutId),
  };
};

export default flushable;
