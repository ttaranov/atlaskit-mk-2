/**
 * Add analytics tests for a component using jscodeshift.
 * Expected to be called from another codeshift.
 */
import fs from 'fs';
import path from 'path';
import UtilPlugin from '../plugins/util';

const findTestFilePath = (filePath) => {
  let foundTestDir = false;
  let curDir = filePath;
  while (!foundTestDir || curDir === '/') {
    curDir = path.resolve(curDir, '..');
    const parentDirContents = fs.readdirSync(curDir);
    foundTestDir = !!(parentDirContents.find( file => file === '__tests__'));
    if (!foundTestDir && !!(parentDirContents.find(file => file === 'package.json'))) {
      break;
    }
  }
  
  if (!foundTestDir || foundTestDir && curDir.indexOf('codemods') >= 0) {
    return null;
  }
  
  const fileBasename = path.basename(filePath);
  const testsDir = path.resolve(curDir, '__tests__');
  const testsDirContents = fs.readdirSync(testsDir);
  // 1. Look for a test file with the same name as fileBasename
  // 2. Look for a file called index.js
  // 3. Create a new file called analytics.js
  let testFile;
  if (!!testsDirContents.find( file => file === fileBasename )) {
    testFile = fileBasename;
  } else if (!!testsDirContents.find(file => file === 'index.js')) {
    testFile = 'index.js';
  } else {
    return null; // 'analytics.js';
  }

  return path.resolve(testsDir, testFile);
}

const contextTest = (j, analyticsConfig) => {
  // TODO: How do we find component name
  const componentName = 'Button';
  const context = 'button';
  // A bug exists in jscodeshift.template.statement where it doesn't replace context if we just
  // string interpolation the component prop value so we interpolate both prop key & value to
  // bypass the issue.
  const contextProp = `component: '${context}'`

  return j.template.statement`

    it('should provide analytics context with component, package and version fields', () => {
      const wrapper = shallow(<${componentName} />);

      expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
        ${contextProp},
        package: name,
        version,
      });
    });
  `;
}

/**
 * Adds/modifies an analytics test file under a __tests__ folder that is
 * either a sibling or ancestor of componentFilePath.
 */
export default (fileInfo, api, options, standaloneCodemod = true) => {
  const j = api.jscodeshift;
  const filePath = fileInfo.path;
  const { statement } = j.template;
  j.use(UtilPlugin);

  let testFilePath;
  if (!standaloneCodemod) {
    testFilePath = findTestFilePath(filePath);
    if (!testFilePath) {
      return null;
    }
  }
  const source = standaloneCodemod ? j(fileInfo.source) : j(fs.readFileSync(testFilePath, 'utf8'));

  // Add imports
  source
    .addImport(statement`
      import { withAnalyticsEvents, withAnalyticsContext, AnalyticsContext } from '@atlaskit/analytics-next';
    `)
    .addImport(statement`
      import { name, version } from '../../package.json';
    `);
  
    // Add describe block + tests
  const describeBlock = j(statement`
    describe('analytics', () => {});
  `)
    .addTest(contextTest(j, { context: 'Avatar' }));

  source.addToProgram(describeBlock.get().node, (context) => {
    const existing = context.find(j.CallExpression, (node) =>
      node.callee.name === 'describe' && node.arguments[0] && node.arguments[0].value === 'analytics'
    );
    return existing.size() === 0;
  });
  
  // Add describe block
  // Add context test
  const parsedSource = source.toSource({ quote: 'single', tabWidth: 2 })
  if (!standaloneCodemod) {
    fs.writeFileSync(testFilePath, parsedSource);
  }
  // console.log('time taken', Date.now() - start);
  return parsedSource;
}