// @flow
import UtilPlugin from '../plugins/util';
import analyticsEventMap from './analyticsEventMap';
import addTests from './tests';

const getMapEntryFromPath = (filepath) => (
  analyticsEventMap.find( eventConfig => (
    filepath.indexOf(eventConfig.path) > -1
  ))
);

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

  const versionProp = j.property('init', j.identifier('version'), j.identifier('version'));
  const contextArgs = j.objectExpression([
    j.property('init', j.identifier('component'), j.literal(eventConfig.context)),
    j.property('init', j.identifier('package'), j.identifier('name')),
    versionProp,
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

  const analyticsEventConfig = getMapEntryFromPath(fileInfo.path);
  if (!analyticsEventConfig) {
    return null;
  }
  
  const sourceWithImports = j(fileInfo.source)
    // Add relevant imports
    .addImport(statement`
      import { withAnalyticsEvents, withAnalyticsContext } from '@atlaskit/analytics-next';
    `)
    .addImport(statement`
      import { name, version } from '../../package.json';
    `)
    .getAST();

  const sourceWithHOC = j(sourceWithImports)
      // Wrap default export with HOCs
      .find(j.ExportDefaultDeclaration)
      .map( path => {
        if (j.Expression.check(path.node.declaration)) {
          // If we're an expression, we can just wrap the current default export
          path.node.declaration = createAnalyticsHocs(j, analyticsEventConfig, path.node.declaration);
        } else if (j.Declaration.check(path.node.declaration)) {
          // Else if we're a declaration, we must extract the declaration out of the export
          // and then wrap the declaration with a HOC within the export
          const declarationId = path.node.declaration.id;
          path.insertBefore(path.node.declaration);
          path.node.declaration = createAnalyticsHocs(j, analyticsEventConfig, declarationId);    
        }
        return path;
      }).getAST();

  // Side-effect time!
  // Add tests to a completely different file than the one currently being modded
  addTests({ path: fileInfo.path }, { jscodeshift: j }, {}, false);
    
  // Print source
  return j(sourceWithHOC).toSource({ quote: 'single' });
};
module.exports.parser = 'flow';