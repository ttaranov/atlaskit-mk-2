const babel = require('babel-core');
const globby = require('globby');
const path = require('path');

const cwd = process.cwd();
const pathToAvatarGroup = path.join(cwd, 'src/components/AvatarGroup.js');

console.log(pathToAvatarGroup);
const options = {
  moduleRoot: cwd,
  sourceMaps: true,
};
const transformed = babel.transformFileSync(pathToAvatarGroup, options).code;
console.log(transformed);
