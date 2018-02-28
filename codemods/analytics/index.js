// @flow
import UtilPlugin from '../plugins/util';

const findLast = function(type) {
  const found = this.find(type);

  return found.at(found.length - 1);
};

const createImport = (j, specifierNames, source) => {
  const specifiers = specifierNames.map(name =>
    j.importSpecifier(j.identifier(name)),
  );

  return j.importDeclaration(specifiers, j.literal(source));
};

const createEventMapPropFn = (j, action) => {
  const params = j.identifier('createAnalyticsEvent');
  const body = j.blockStatement([]);
  const code = `
    createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: '${action}',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    }
  `;

  return j(code)
    .find(j.ArrowFunctionExpression)
    .get().value;
};

const createAnalyticsEventsHoc = (j, createEventMap, inner) => {
  const eventMap = j.objectExpression(
    Object.keys(createEventMap).map(propName => {
      const action = createEventMap[propName];
      return j.property(
        'init',
        j.identifier(propName),
        createEventMapPropFn(j, action),
      );
    }),
  );
  const firstCall = j.callExpression(j.identifier('withAnalyticsEvents'), [
    eventMap,
  ]);

  return j.callExpression(firstCall, [inner.value.declaration]);
};

module.exports = (fileInfo: any, api: any) => {
  const j = api.jscodeshift;
  j.use(UtilPlugin);
  // if (!j.Collection.prototype.hasOwnProperty('findLast')) {
  //   j.registerMethods({
  //     findLast,
  //   });
  // }

  const sourceWithImports = j(fileInfo.source)
    // Add relevant imports
    .findLast(j.ImportDeclaration)
    .insertAfter(
      createImport(
        j,
        ['withAnalyticsEvents', 'withAnalyticsContext'],
        '@atlaskit/analytics-next',
      ),
    )
    .closest(j.Program)
    .findLast(j.ImportDeclaration)
    .insertAfter(createImport(j, ['name', 'version'], '../../package.json'))
    .getAST();

  const sourceWithHOC = j(sourceWithImports)
    // Wrap default export with HOCs
    .find(j.ExportDefaultDeclaration)
    .map(path => {
      path.value.declaration = createAnalyticsEventsHoc(
        j,
        { onClick: 'click' },
        path,
      );
      return path;
    })
    .getAST();

  // Print source
  return j(sourceWithHOC).toSource({ quote: 'single' });
};
module.exports.parser = 'flow';
