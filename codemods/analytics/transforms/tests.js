// @flow
/**
 * Add analytics tests for a component
 */
import path from 'path';
import UtilPlugin from '../../plugins/util';
import { getMapEntryFromPath, getPackageJsonPath } from '../util';

const contextTest = (j, analyticsConfig) => {
  const componentName = analyticsConfig.component;
  const context = analyticsConfig.context;

  return j('').code(`

    it('should provide analytics context with component, package and version fields', () => {
      const wrapper = shallow(<${componentName} />);

      expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
        component: '${context}',
        package: packageName,
        version: packageVersion
      });
    });
  `);
}

const propTest = (j, analyticsConfig, prop, action) => {
  const componentName = analyticsConfig.component;

  return j('').code(`

    it('should pass analytics event as last argument to ${prop} handler', () => {
      const spy = jest.fn();
      const wrapper = mount(<${componentName} ${prop}={spy} />);
      wrapper.find('button').simulate('${action}');

      const analyticsEvent = spy.mock.calls[0][1];
      expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
      expect(analyticsEvent.payload).toEqual(
        expect.objectContaining({
          action: '${action}',
        }),
      );
    });
  `);
}

const atlaskitTest = (j, analyticsConfig, prop, action) => {
  const componentName = analyticsConfig.component;
  const context = analyticsConfig.context;

  return j('').code(`

    it('should fire an atlaskit analytics event on ${action}', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <AnalyticsListener onEvent={spy} channel="atlaskit">
          <${componentName} />
        </AnalyticsListener>,
      );

      wrapper.find(${componentName}).simulate('${action}');
      const [analyticsEvent, channel] = spy.mock.calls[0];

      expect(channel).toBe('atlaskit');
      expect(analyticsEvent.payload).toEqual({ action: '${action}' });
      expect(analyticsEvent.context).toEqual([
        {
          component: '${context}',
          package: packageName,
          version: packageVersion
        },
      ]);
    });
  `);
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