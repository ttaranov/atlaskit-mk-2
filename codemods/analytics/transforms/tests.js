// @flow
/**
 * Add analytics tests for a component
 */
import path from 'path';
import UtilPlugin from '../../plugins/util';
import { getMapEntryFromPath, getPackageJsonPath, getRelativeComponentPath } from '../util';

const contextTest = (j, analyticsConfig) => {
  const componentName = `${analyticsConfig.component}WithAnalytics`;
  const context = analyticsConfig.context;

  const mountOrShallow = analyticsConfig.wrapTarget ? 'mount' : 'shallow';

  return j('').code(`

    it('should provide analytics context with component, package and version fields', () => {
      const wrapper = ${mountOrShallow}(<${componentName} />);

      expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
        component: '${context}',
        package: packageName,
        version: packageVersion
      });
    });
  `);
}

const propTest = (j, analyticsConfig, prop, action) => {
  const componentName = `${analyticsConfig.component}WithAnalytics`;

  return j('').code(`

    it('should pass analytics event as last argument to ${prop} handler', () => {
    });
  `);
}

const atlaskitTest = (j, analyticsConfig, prop, action) => {
  const componentName = `${analyticsConfig.component}WithAnalytics`;
  const context = analyticsConfig.context;

  return j('').code(`

    it('should fire an atlaskit analytics event on ${action}', () => {
    });
  `);
}

const removeExistingComponentImport = (j, root, componentName) => {
  [j.ImportDefaultSpecifier, j.ImportSpecifier].find( importType => {
    const existingImport = root
      .find(importType, { local: { name: componentName } });

    if (existingImport.size() === 1) {
      const importPath = existingImport.get();
      // importPath.name is the index of the specifier
      importPath.parent.node.specifiers.splice(importPath.name, 1);
      if (importPath.parent.node.specifiers.length === 0) {
        importPath.parent.prune();
      }
      return true;
    } else if (existingImport.size() === 0) {
      console.log(`No ${importType} was found for ${componentName}`);
    } else {
      throw new Error(`Found more than one default import for ${componentName}`);
    }
  });
}

export const parser = 'flow';

/**
 * Inserts tests for the file if it exists in a testPath prop in the analytics event map
 */
export default (fileInfo: any, api: any) => {
  const j = api.jscodeshift;
  j.use(UtilPlugin);
  
  const analyticsEventConfigs = getMapEntryFromPath(fileInfo.path, 'testPath');
  if (!analyticsEventConfigs || analyticsEventConfigs.length === 0) {
    return null;
  }
  const source = j(fileInfo.source);

  const firstNodeBefore = source.getFirstNode();
  

  // Add imports
  const absoluteFilePath = path.resolve(process.cwd(), fileInfo.path);
  const packageJsonPath = getPackageJsonPath(absoluteFilePath);
  source
    .addImport(source.code(`
      import { AnalyticsListener, AnalyticsContext, UIAnalyticsEvent } from '@atlaskit/analytics-next';
    `))
    .addImport(source.code(`
      import { name as packageName, version as packageVersion } from '${packageJsonPath}';
    `))
    .addImport(source.code(`
      import { mount, shallow } from 'enzyme';
    `));
  
  analyticsEventConfigs.forEach( analyticsEventConfig => {
    const componentName = analyticsEventConfig.component;
    const componentPath = getRelativeComponentPath(analyticsEventConfig);
    removeExistingComponentImport(j, source, componentName);
    source.addImport(source.code(`
      import ${componentName}WithAnalytics, { ${componentName} } from '${componentPath}';
    `));
    // Add describe block + tests
    const describeBlock = source.getOrAdd(source.code(`
      describe('analytics - ${analyticsEventConfig.component}', () => {});
    `), context => {
        return context.find(j.CallExpression, (node) =>
          node.callee.name === 'describe' && node.arguments[0] && node.arguments[0].value === `analytics - ${analyticsEventConfig.component}`
        );
    });

    describeBlock
      .addTest(contextTest(j, analyticsEventConfig));

    Object.keys(analyticsEventConfig.props).forEach( prop => {
      const action = analyticsEventConfig.props[prop];

      describeBlock.addTest(propTest(j, analyticsEventConfig, prop, action));
    });

    Object.keys(analyticsEventConfig.props).forEach(prop => {
      const action = analyticsEventConfig.props[prop];

      describeBlock.addTest(atlaskitTest(j, analyticsEventConfig, prop, action));
    });
  });

  // If the first node has been modified or deleted, reattach the comments
  const firstNodeAfter = source.getFirstNode();
  if (firstNodeBefore !== firstNodeAfter) {
    firstNodeAfter.comments = firstNodeBefore.comments;
    delete firstNodeBefore.comments;
  }
  
  // Add describe block
  // Add context test
  const parsedSource = source.toSource({ quote: 'single', tabWidth: 2 });
  return parsedSource;
}