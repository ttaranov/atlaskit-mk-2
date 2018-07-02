export const requestFullScreen = (element: HTMLElement) => {
  const methods = [
    'requestFullscreen',
    'webkitRequestFullscreen',
    'mozRequestFullScreen',
    'msRequestFullscreen',
  ];
  const methodName = methods.find(name => element[name]);

  if (methodName && element[methodName]) {
    element[methodName]();
  }
};

export const exitFullscreen = () => {
  const methods = [
    'exitFullscreen',
    'webkitExitFullscreen',
    'mozExitFullscreen',
    'msExitFullscreen',
  ];
  const methodName = methods.find(name => document[name]);

  if (methodName && document[methodName]) {
    document[methodName]();
  }
};

export const getFullscreenElement = (): HTMLElement | undefined => {
  const properties = [
    'exitFullscreen',
    'webkitCurrentFullScreenElement',
    'mozCurrentFullScreenElement',
    'msCurrentFullScreenElement',
  ];
  const propertyName = properties.find(name => document[name]);

  return propertyName && document[propertyName];
};

export const toggleFullscreen = (element?: HTMLElement) => {
  if (getFullscreenElement()) {
    exitFullscreen();
  } else if (element) {
    requestFullScreen(element);
  }
};
