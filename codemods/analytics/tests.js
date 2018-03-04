/**
 * Add analytics tests for a component using jscodeshift.
 * Expected to be called from another codeshift.
 */
import path from 'path';
import UtilPlugin from '../plugins/util';
import { getMapEntryFromPath, getPackageJsonPath } from './util';

const contextTest = (j, analyticsConfig) => {
  const componentName = analyticsConfig.component;
  const context = analyticsConfig.context;

  return j('').code(`

    it('should provide analytics context with component, package and version fields', () => {
      const wrapper = shallow(<${componentName} />);

      expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
        component: '${context}',
        package: name,
        version,
      });
    });
  `);
}

export const parser = 'flow';

/**
 * Adds/modifies an analytics test file under a __tests__ folder that is
 * either a sibling or ancestor of componentFilePath.
 */
export default (fileInfo, api) => {
  const j = api.jscodeshift;
  j.use(UtilPlugin);
  
  const analyticsEventConfig = getMapEntryFromPath(fileInfo.path, 'testPath');
  if (!analyticsEventConfig) {
    return null;
  }
  const source = j(fileInfo.source);
  // Add imports
  const absoluteFilePath = path.resolve(process.cwd(), fileInfo.path);
  const packageJsonPath = getPackageJsonPath(absoluteFilePath);
  source
    .addImport(source.code(`
      import { withAnalyticsEvents, withAnalyticsContext, AnalyticsContext } from '@atlaskit/analytics-next';
    `))
    .addImport(source.code(`
      import { name, version } from '${packageJsonPath}';
    `));
  
    // Add describe block + tests
  const describeBlock = j(source.code(`
    describe('analytics', () => {});
  `))
    .addTest(contextTest(j, analyticsEventConfig));

  source.addToProgram(describeBlock.get().node, (context) => {
    const existing = context.find(j.CallExpression, (node) =>
      node.callee.name === 'describe' && node.arguments[0] && node.arguments[0].value === 'analytics'
    );
    return existing.size() === 0;
  });
  
  // Add describe block
  // Add context test
  const parsedSource = source.toSource({ quote: 'single', tabWidth: 2 })

  // console.log('time taken', Date.now() - start);
  return parsedSource;
}