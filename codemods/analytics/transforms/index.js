// @flow
import path from 'path';
import UtilPlugin from '../../plugins/util';

import { getMapEntryFromPath, getPackageJsonPath } from '../util';
import addTests from './tests';

const createImport = (j, specifierNames, source) => {
  const specifiers = specifierNames.map( name =>
    j.importSpecifier(j.identifier(name))
  );

  return j.importDeclaration(specifiers, j.literal(source));
};

const createEventMapPropFn = (j, action) => {
  const code = `
    createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: '${action}',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    }
  `;

  return j(code).find(j.ArrowFunctionExpression).get().value;
};

const createAnalyticsEventsHoc = (j, eventConfig, inner) => {
  const existingHoc = j(inner).find(j.Identifier, { name: 'withAnalyticsEvents' });
  if (existingHoc.size() > 0) {
    return inner;
  }

  const eventMap = j.objectExpression(Object.keys(eventConfig.props).map( propName => {
    const action = eventConfig.props[propName];
    return j.property('init', j.identifier(propName), createEventMapPropFn(j, action));
  }));
  const firstCall = j.callExpression(j.identifier('withAnalyticsEvents'), [eventMap]);
  return j.callExpression(firstCall, [inner]);
};

const createAnalyticsContextHoc = (j, eventConfig, inner) => {
  const existingHoc = j(inner).find(j.Identifier, { name: 'withAnalyticsContext' });
  if (existingHoc.size() > 0) {
    return inner;
  }

  const contextArgs = j.objectExpression([
    j.property('init', j.identifier('component'), j.literal(eventConfig.context)),
    j.property('init', j.identifier('package'), j.identifier('packageName')),
    j.property('init', j.identifier('version'), j.identifier('packageVersion'))
  ]);

  const firstCall = j.callExpression(j.identifier('withAnalyticsContext'), [contextArgs]);
  return j.callExpression(firstCall, [inner]);
}

const createAnalyticsHocs = (j, eventConfig, inner) => {
  const withAnalyticsEvents = createAnalyticsEventsHoc(j, eventConfig, inner);

  return createAnalyticsContextHoc(j, eventConfig, withAnalyticsEvents);
}

module.exports = (fileInfo: any, api: any) => {
  const j = api.jscodeshift;
  const { statement } = j.template;
  j.use(UtilPlugin);

  const analyticsEventConfig = getMapEntryFromPath(fileInfo.path, 'path');
  if (!analyticsEventConfig) {
    return null;
  }
  const source = j(fileInfo.source);
  
  const absoluteFilePath = path.resolve(process.cwd(), fileInfo.path);
  const packageJsonPath = getPackageJsonPath(absoluteFilePath);

  source
    // Add relevant imports
    .addImport(source.code(`
      import { withAnalyticsEvents, withAnalyticsContext } from '@atlaskit/analytics-next';
    `))
    .addImport(source.code(`
      import { name as packageName, version as packageVersion } from '${packageJsonPath}';
    `));

  if (analyticsEventConfig.wrapTarget) {
    source
      .findLast(j.VariableDeclarator, (node) => node.id.name === analyticsEventConfig.wrapTarget)
      .map( path => {
        path.node.init = createAnalyticsHocs(j, analyticsEventConfig, path.node.init);
      });
  } else {
    source
      .find(j.ExportDefaultDeclaration)
      .map( path => {
        if (j.Expression.check(path.node.declaration)) {
          // If we're an expression, we can just wrap the current default export
          path.node.declaration = createAnalyticsHocs(j, analyticsEventConfig, path.node.declaration);
        } else if (j.Declaration.check(path.node.declaration)) {
          // Else if we're a declaration, we must extract the declaration out of the export
          // and then wrap the declaration with a HOC within the export
          if (j.ClassDeclaration.check(path.node.declaration)) {
            const declarationId = path.node.declaration.id;
            path.insertBefore(path.node.declaration);
            path.node.declaration = createAnalyticsHocs(j, analyticsEventConfig, declarationId);
          } else {
            throw new Error('Default function export found. Please specify a wrapTarget in analyticsEventMap or refactor the code first to provide a default class export or function call');
          }   
        }
        return path;
      });
  }
    
  // Print source
  return source.toSource({ quote: 'single' });
};
module.exports.parser = 'flow';