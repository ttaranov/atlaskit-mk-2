// @flow

const canUseDom = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

const supportsVoiceOver = () =>
  /Mac OS X/.test(canUseDom() ? navigator.userAgent : '');

export default supportsVoiceOver;
