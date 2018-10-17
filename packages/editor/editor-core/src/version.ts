import { name, version } from '../package.json';

const nextMajorVersion = () => {
  return [Number(version.split('.')[0]) + 1, 0, 0].join('.');
};

export { name, version, nextMajorVersion };
