export const DEVELOPMENT_LOGGER = {
  safeError(...rest) {
    console.error(...rest);
  },
  safeInfo(...rest) {
    console.info(...rest);
  },
  safeWarn(...rest) {
    console.warn(...rest);
  },
};
