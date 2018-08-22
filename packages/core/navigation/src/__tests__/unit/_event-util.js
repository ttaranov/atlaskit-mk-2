// @flow
import root from 'window-or-global';

// eslint-disable-next-line import/prefer-default-export
export const dispatchMouseEvent = (
  eventName: string,
  options?: Object = {},
  target: EventTarget = root,
): MouseEvent => {
  const event = new root.MouseEvent(eventName, {
    bubbles: true,
    cancelable: true,
    view: root,
    ...options,
  });

  target.dispatchEvent(event);
  return event;
};
