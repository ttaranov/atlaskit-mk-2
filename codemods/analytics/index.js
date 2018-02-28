// @flow
import UtilPlugin from '../plugins/util';

const createImport = (j, specifierNames, source) => {
  const specifiers = specifierNames.map( name =>
    j.importSpecifier(j.identifier(name))
  );

  return j.importDeclaration(specifiers, j.literal(source));
}

const createEventMapPropFn = (j, action) => {
  const params = j.identifier('createAnalyticsEvent');
  const body = j.blockStatement([
  ]);
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
}

const createAnalyticsEventsHoc = (j, filePath, inner) => {
  console.log(filePath);
  const createEventMap = { onClick: 'click' };
  const eventMap = j.objectExpression(Object.keys(createEventMap).map( propName => {
    const action = createEventMap[propName];
    return j.property('init', j.identifier(propName), createEventMapPropFn(j, action));
  }));
  const firstCall = j.callExpression(j.identifier('withAnalyticsEvents'), [eventMap]);

  return j.callExpression(firstCall, [inner.value.declaration]);
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
        path.value.declaration = createAnalyticsEventsHoc(j, fileInfo.path, path);
        return path;
      }).getAST();
    
  // Print source
  return j(sourceWithHOC).toSource({ quote: 'single' });
};
module.exports.parser = 'flow';