// @flow
import UtilPlugin from '../plugins/util';
import analyticsEventMap from './analyticsEventMap';

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

const createAnalyticsEventsHoc = (j, filePath, inner) => {
  const createEventMap = getMapEntryFromPath(filePath);
  if (!createEventMap) {
    throw new Error('Event map entry not found for this file');
  }
  const eventMap = j.objectExpression(Object.keys(createEventMap.props).map( propName => {
    const action = createEventMap.props[propName];
    return j.property('init', j.identifier(propName), createEventMapPropFn(j, action));
  }));
  const firstCall = j.callExpression(j.identifier('withAnalyticsEvents'), [eventMap]);
  return j.callExpression(firstCall, [inner]);
};

const createAnalyticsContextHoc = (j, filePath, inner) => {
  const createEventMap = getMapEntryFromPath(filePath);
  if (!createEventMap) {
    throw new Error('Event map entry not found for this file');
  }
  const versionProp = j.property('init', j.identifier('version'), j.identifier('version'));
  const contextArgs = j.objectExpression([
    j.property('init', j.identifier('component'), createEventMap.context),
    j.property('init', j.identifier('package'), j.identifier('name')),
    versionProp,
  ]);

  const firstCall = j.callExpression(j.identifier('withAnalyticsContext'), [contextArgs]);

  const code = `
    withAnalyticsContext({
      component: 'button',
      package: name,
      version,
    })(
  `;
}

module.exports = (fileInfo: any, api: any) => {
  const j = api.jscodeshift;
  j.use(UtilPlugin);

  const existingImports = j(fileInfo.source)
    .find(j.ImportDeclaration)
    .filter( path => 
      path.value.source.value === '@atlaskit/analytics-next'
    );
  
  const sourceWithImports = existingImports.size() > 0 ?
    fileInfo.source
  : j(fileInfo.source)
    // Add relevant imports
    .findLast(j.ImportDeclaration)
    .insertAfter(createImport(j, ['withAnalyticsEvents', 'withAnalyticsContext'], '@atlaskit/analytics-next'))
    .closest(j.Program)
    .findLast(j.ImportDeclaration)
    .insertAfter(createImport(j, ['name', 'version'], '../../package.json'))
    .getAST();

  const existingHOC = j(fileInfo.source)
    .find(j.ExportDefaultDeclaration)
    .find(j.CallExpression)
    .find(j.Identifier, { name: 'withAnalyticsEvents'});

  const sourceWithHOC = existingHOC.size() > 0
    ? sourceWithImports
    : j(sourceWithImports)
      // Wrap default export with HOCs
      .find(j.ExportDefaultDeclaration)
      .map( path => {
        if (j.Expression.check(path.value.declaration)) {
          // If we're an expression, we can just wrap the current default export
          path.value.declaration = createAnalyticsEventsHoc(j, fileInfo.path, path.value.declaration);
        } else if (j.Declaration.check(path.value.declaration)) {
          // Else if we're a declaration, we must extract the declaration out of the export
          // and then wrap the declaration with a HOC within the export
          const declarationId = path.value.declaration.id;
          path.insertBefore(path.value.declaration);
          path.value.declaration = createAnalyticsEventsHoc(j, fileInfo.path, declarationId);    
        }
        return path;
      }).getAST();
    
  // Print source
  return j(sourceWithHOC).toSource({ quote: 'single' });
};
module.exports.parser = 'flow';