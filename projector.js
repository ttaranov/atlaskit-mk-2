// @flow

const spawn = require('projector-spawn');
const jest = require('projector-jest');
const ts = require('projector-typescript');
const tslint = require('projector-tslint');
const karma = require('projector-karma');
const path = require('path');
const glob = require('glob');
const getKarmaConfig = require('./packages/build/karma-config');
const release = require('./packages/build/releases/release');
const version = require('./packages/build/releases/version');
const query = require('pyarn-query');

/* ::
type WorkspaceQueryResult = {
  workspaces: Array<{
    dir: string,
    files: {
      babel: Array<any>,
      typescript: Array<any>,
    },
    pkg: Object,
  }>,
};
*/

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

const browserTestComponent = async cwd => {
  const files = glob.sync(`${cwd}/tests/browser/**/*.+(js|jsx|ts|tsx)`);
  await karma.run({
    files,
    config: getKarmaConfig(),
  });
};

exports.lint = async () => {
  const components = ['code'];
  for (const name of components) {
    await lintTSComponent(path.join(__dirname, 'packages', 'fabric', name));
  }
};

exports.build = async () => {
  const packages /* : WorkspaceQueryResult */ = await query({
    cwd: process.cwd(),
    workspaceFiles: {
      babel: 'src/index.js',
      typescript: 'src/index.ts',
    },
  });

  await Promise.all(
    packages.workspaces.filter(({ pkg }) => !pkg.private).map(async ({ dir, files }) => {
      if (files.babel.length) {
        return await spawn('babel', ['src', '-d', 'dist/cjs'], { cwd: dir });
      } else if (files.typescript.length) {
        return Promise.all([await lintTSComponent(dir), await buildTSComponent(dir)]);
      }
      return Promise.resolve();
    })
  );
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

    testRegex: '(/__tests__/.*)\\.(test|spec)\\.(tsx?|jsx?)$',

    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  });

  const components = ['code'];
  for (const name of components) {
    await browserTestComponent(path.join(__dirname, 'packages', 'fabric', name));
  }
};

exports.version = async () => {
  await version.run({
    rootDir: __dirname,
  });
};

exports.release = async () => {
  await release.run({
    rootDir: __dirname,
  });
};
