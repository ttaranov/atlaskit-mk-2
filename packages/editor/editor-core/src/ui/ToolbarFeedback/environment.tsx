export function getSensitiveEnvironment() {
  return {
    location: window.location.href,
    referrer: window.document.referrer,
  };
}

export function getBasicEnvironment(packageName, packageVersion) {
  return {
    packageName,
    packageVersion,
    // browser: getBrowserInfo(navigator.userAgent),
    // os: getDeviceInfo(navigator.userAgent, navigator.appVersion),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width} x ${screen.height}`,
  };
}
