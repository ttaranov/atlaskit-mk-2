// @flow
const spawn = require('projector-spawn');
const jest = require('projector-jest');
const ts = require('projector-typescript');
const tslint = require('projector-tslint');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const version = require('./build/releases/version');

const buildTSComponent = async cwd => {
  // ES5
  await ts.compile({ cwd });

  // ES2015
  await ts.compile({
    cwd,
    compilerOptions: {
      module: 'es2015',
      outDir: './dist/es2015',
    },
  });
};

const lintTSComponent = async cwd => {
  const files = glob.sync(`${cwd}/src/**/*.+(ts|tsx)`);
  await tslint.run({
    files,
    configPath: './tslint.base.json',
    linterOptions: {
      formatter: 'stylish',
    },
  });
};

exports.build = async () => {
  const components = ['badge', 'code', 'lozenge', 'tag', 'tag-group'].map(name => path.join('components', name));
  const utils = ['docs'].map(name => path.join('utils', name));

  for (const relativePath of components.concat(utils)) {
    const cwd = path.join(__dirname, relativePath);
    if (fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
      await lintTSComponent(cwd);
      await buildTSComponent(cwd);
    } else {
      await spawn('babel', ['src', '-d', 'dist/cjs'], { cwd });
    }
  }

  await spawn('babel', ['src', '-d', 'dist/cjs'], {
    cwd: path.join(__dirname, 'utils', 'docs'),
  });
};

exports.test = async () => {
  await jest.test({
    rootDir: __dirname,

    transform: JSON.stringify({
      '^.+\\.tsx?$': 'ts-jest/preprocessor',
      '^.+\\.jsx?$': 'babel-jest',
    }),

    globals: JSON.stringify({
      'ts-jest': {
        tsConfigFile: path.join(__dirname, 'tsconfig.base.json'),
        // we can safely disable babel for perf improvements since we don't use synthetic imports
        // @see https://github.com/kulshekhar/ts-jest#supports-synthetic-modules
        skipBabel: true,
      },
    }),

    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$',

    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  });
};

exports.version = async () => {
  await version.run({
    rootDir: __dirname,
  });
};
