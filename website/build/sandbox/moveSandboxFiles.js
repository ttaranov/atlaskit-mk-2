// @flow

const babylon = require('babylon');
const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');
const traverse = require('babel-traverse').default;

// This is a little helper function for finding the actual file that an import statement is pointing to
// i.e. it will figure out whether '../module' is referring to '../module/index.js' or '../module.js'
const getImportFilepath = (currentFilepath, relativeImportPath) => {
  const importPath = path.join(
    path.parse(currentFilepath).dir,
    relativeImportPath,
  );
  const fileOrDir = globby.sync(`${importPath}*`)[0];
  const isDirectory = !path.parse(fileOrDir).ext;
  return isDirectory ? path.join(fileOrDir, 'index.js') : fileOrDir;
};

// A recursive function that takes a filepath and returns an array
// of its relative imports, their relative imports, and so on.
const followRelativeImports = filepath => {
  const imports = [filepath];

  // Read the file
  const code = fs.readFileSync(filepath).toString();
  // Parse it into an AST
  const ast = babylon.parse(code, {
    allowImportExportEverywhere: true,
    plugins: ['jsx', 'flow', 'classProperties', 'objectRestSpread'],
  });
  traverse(ast, {
    enter(nodePath) {
      if (
        // If it's a relative import statement...
        (nodePath.node.type === 'ImportDeclaration' &&
          nodePath.node.source.value[0] === '.') ||
        // ... or if it's an export statement that directly exports a relative import
        (nodePath.node.type === 'ExportNamedDeclaration' &&
          nodePath.node.source &&
          nodePath.node.source.value[0] === '.')
      ) {
        const importedFilepath = getImportFilepath(
          filepath,
          nodePath.node.source.value,
        );
        // Recursion!
        imports.push(...followRelativeImports(importedFilepath));
      }
    },
  });
  // De-dupe imports
  return imports.reduce(
    (dedupedImports, file) =>
      dedupedImports.includes(file)
        ? dedupedImports
        : [...dedupedImports, file],
    [],
  );
};

// This function takes a component and the name of an example file, and
// builds a Codesandbox-compatible project in the website's dist folder
module.exports = (component /*: string */, example /*: string */) => {
  // The component root
  const root = path.join(
    process.cwd(),
    '..',
    'packages',
    'elements',
    component,
  );

  // Source files and directories
  const sourceMainFile = path.join(root, 'examples', `${example}.js`);
  const componentPackageJSONPath = path.join(root, 'package.json');

  // Destination files and directories
  const destinationDir = path.join(
    process.cwd(),
    'dist',
    'sandbox',
    component,
    example,
  );
  const destinationSrcDir = path.join(destinationDir, 'src');
  const sandboxMainFile = path.join(destinationSrcDir, 'examples', 'index.js');

  // Files that we're going to write
  const sandboxMainJSFilepath = path.join(destinationSrcDir, 'index.js');
  const sandboxPackageJSON = path.join(destinationDir, 'package.json');
  const sandboxSandboxJSON = path.join(destinationDir, 'sandbox.json');

  // Start at the example entry point and build an array of dependencies
  const srcFiles = followRelativeImports(sourceMainFile)
    // Remove the entrypoint - we'll be copying this across separately
    .filter(file => file !== sourceMainFile);

  // Empty the destination directories
  fs.emptyDirSync(destinationDir);
  fs.emptyDirSync(destinationSrcDir);

  // Copy the entrypoint file across
  fs.copySync(sourceMainFile, sandboxMainFile);

  // Copy all of the relative deps across
  srcFiles.forEach(filepath => {
    const destinationPath = path.join(
      destinationSrcDir,
      filepath.replace(root, ''),
    );
    fs.copySync(filepath, destinationPath);
  });

  // Write an index.js file for the sandbox project
  const indexJSTemplate = `// @flow

/**
 * To play with this sandbox edit the files in the example directory
 */

import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import Example from './examples';

ReactDOM.render(<Example />, document.getElementById('root'));
`;
  fs.outputFileSync(sandboxMainJSFilepath, indexJSTemplate);

  const componentPackageJSON = JSON.parse(
    fs.readFileSync(componentPackageJSONPath),
  );
  // Compile all the deps. This example might not need all of them,
  // but for now we're playing it safe and getting them all.
  const componentDeps = {
    ...componentPackageJSON.devDependencies,
    ...componentPackageJSON.peerDependencies,
    ...componentPackageJSON.dependencies,
  };

  const templatePackageJSON = {
    name: `atlaskit-${component}-sandbox`,
    version: '0.1.0',
    private: true,
    dependencies: {
      '@atlaskit/css-reset': '*',
      react: '^16.0.0',
      'react-dom': '^16.0.0',
      'react-scripts': '1.0.15',
      ...componentDeps,
    },
    scripts: {
      start: 'react-scripts start',
      build: 'react-scripts build',
      test: 'react-scripts test --env=jsdom',
      eject: 'react-scripts eject',
    },
  };

  // Write a package.json file for the sandbox project
  const packageJSONString = JSON.stringify(templatePackageJSON, null, 2);
  fs.outputFileSync(sandboxPackageJSON, packageJSONString);

  const sandboxFiles = globby
    .sync(path.join(destinationDir, '**/*.*'))
    .map(fullPath => fullPath.replace(destinationDir, ''));

  // Write a sandbox.json file. This is used by the deployment
  // service to know which files it needs to deploy
  const sandboxJSONString = JSON.stringify({ files: sandboxFiles }, null, 2);
  fs.outputFileSync(sandboxSandboxJSON, sandboxJSONString);
};
