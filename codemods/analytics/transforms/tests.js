// @flow
/**
 * Add analytics tests for a component
 */
import path from 'path';
import get from 'lodash.get';
import UtilPlugin from '../../plugins/util';
import { getMapEntryFromPath, getPackageJsonPath, getRelativeComponentPath } from '../util';

const contextOverwriteTest = (j, analyticsConfig) => {
  return j('').code(`
    it('should override the existing analytics context of ${analyticsConfig.overwrite}', () => {
      const wrapper = mount(<${analyticsConfig.component} />);

      expect(wrapper.find(${analyticsConfig.overwrite}).prop('analyticsContext')).toEqual({
        component: '${analyticsConfig.context}',
        package: packageName,
        version: packageVersion
      });
    });
  `);
}

const contextTest = (j, analyticsConfig) => {
  const componentName = `${analyticsConfig.component}WithAnalytics`;
  const context = analyticsConfig.context;

  const mountOrShallow = analyticsConfig.wrapTarget ? 'mount' : 'shallow';

  return analyticsConfig.overwrite
    ? contextOverwriteTest(j, analyticsConfig)
    : j('').code(`
      it('should be wrapped with analytics context', () => {
        expect(withAnalyticsContext).toHaveBeenCalledWith({
          component: '${context}',
          package: packageName,
          version: packageVersion
        });
      });
    `);
}

const propTest = (j, analyticsConfig) => {
  const componentName = `${analyticsConfig.component}WithAnalytics`;

  const props = Object.keys(analyticsConfig.props).map( prop => {
    const action = analyticsConfig.props[prop];
    return `${prop}: { action: '${action}' },`;
  })

  return j('').code(`

    it('should be wrapped with analytics events', () => {
      expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
      expect(withAnalyticsEvents).toHaveBeenCalledWith({
        ${props.join('\n')}
      });
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

const jestMock = () => {
  return `

    // This is a global mock for this file that will mock all components wrapped with analytics
    // and replace them with an empty SFC that returns null. This includes components imported
    // directly in this file and others imported as dependencies of those imports.
    jest.mock('@atlaskit/analytics-next', () => ({
      withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
      withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
      createAndFireEvent: jest.fn(() => jest.fn(args => args)),
    }));

  `;
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
  if (analyticsEventConfigs.length > 1) {
    throw new Error('Each entry must have a unique testPath file');
  }
  const source = j(fileInfo.source);

  const firstNodeBefore = source.getFirstNode();
  
  const analyticsConfig = analyticsEventConfigs[0];

  // Add imports
  const absoluteFilePath = path.resolve(process.cwd(), fileInfo.path);
  const packageJsonPath = getPackageJsonPath(absoluteFilePath);
  source
    .addImport(source.code(`
      import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent } from '@atlaskit/analytics-next';
    `))
    .addImport(source.code(`
      import { name as packageName, version as packageVersion } from '${packageJsonPath}';
    `))
    .getOrAdd(source.code(jestMock()), context => {
      return context.find(j.ExpressionStatement, (node) => (
        get(node, 'expression.callee.object.name') === 'jest' &&
        get(node, 'expression.callee.property.name') === 'mock'
      ));
    });
  if (analyticsConfig.overwrite) {
    source
      .addImport(source.code(`
      import React from 'react';
      `))
      .addImport(source.code(`
        import { mount } from 'enzyme';
      `))
      .addImport(source.code(`
        import ${analyticsConfig.overwrite} from '${analyticsConfig.overwritePackage}';
      `));
  }
  
  const componentName = analyticsConfig.component;
  const componentPath = getRelativeComponentPath(analyticsConfig);
  // No longer needed since we're now running analytics tests in their own file
  // removeExistingComponentImport(j, source, componentName);
  const componentImport = analyticsConfig.overwrite
    ? `import { ${componentName} } from '${componentPath}';`
    : `import '${componentPath}';`;
  source.addImport(source.code(`
    ${componentImport}

  `));
  // Add describe block + tests
  const describeBlock = source.getOrAdd(source.code(`
    describe('${analyticsConfig.component}', () => {});
  `), context => {
      return context.find(j.ExpressionStatement, (node) =>
        get(node, 'expression.callee.name') === 'describe' &&
        get(node, 'expression.arguments[0].value') === `${analyticsConfig.component}`
      );
  });

  describeBlock
    .addTest(contextTest(j, analyticsConfig))
    .addTest(propTest(j, analyticsConfig));

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