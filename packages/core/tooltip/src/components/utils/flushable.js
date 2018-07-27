// @flow

// a timeout function that can be flushed and cancelled
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
