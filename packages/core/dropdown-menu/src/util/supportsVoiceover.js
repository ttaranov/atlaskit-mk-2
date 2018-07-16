// @flow

const supportsVoiceOver = () => /Mac OS X/.test(navigator.userAgent);

export default supportsVoiceOver;
