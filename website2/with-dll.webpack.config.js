'use strict';
const path = require('path');
const webpack = require('webpack');
const cwd = process.cwd();

const PACKAGES = [
  '@atlaskit/analytics',
  '@atlaskit/layer',
  '@atlaskit/lozenge',
  '@atlaskit/size-detector',
  '@atlaskit/theme',
  '@atlaskit/badge',
  '@atlaskit/code',
  '@atlaskit/field-range',
  '@atlaskit/spinner',
  '@atlaskit/input',
  '@atlaskit/blanket',
  '@atlaskit/pagination',
  '@atlaskit/tabs',
  '@atlaskit/empty-state',
  '@atlaskit/progress-indicator',
  '@atlaskit/progress-tracker',
  '@atlaskit/field-base',
  '@atlaskit/field-text',
  '@atlaskit/analytics-next',
  '@atlaskit/field-text-area',
  '@atlaskit/button',
  '@atlaskit/toggle',
  '@atlaskit/field-radio-group',
  '@atlaskit/logo',
  '@atlaskit/checkbox',
  '@atlaskit/calendar',
  '@atlaskit/banner',
  '@atlaskit/page',
  '@atlaskit/icon',
  '@atlaskit/tooltip',
  '@atlaskit/droplist',
  '@atlaskit/single-select',
  '@atlaskit/inline-dialog',
  '@atlaskit/inline-message',
  '@atlaskit/select',
  '@atlaskit/breadcrumbs',
  '@atlaskit/table-tree',
  '@atlaskit/tag',
  '@atlaskit/item',
  '@atlaskit/avatar',
  '@atlaskit/comment',
  '@atlaskit/dropdown-menu',
  '@atlaskit/tag-group',
  '@atlaskit/dynamic-table',
  '@atlaskit/navigation',
  '@atlaskit/navigation-next',
  '@atlaskit/nps',
  '@atlaskit/multi-select',
  '@atlaskit/inline-edit',
  '@atlaskit/page-header',
  '@atlaskit/modal-dialog',
  '@atlaskit/datetime-picker',
  '@atlaskit/form',
  '@atlaskit/layer-manager',
  '@atlaskit/flag',
  '@atlaskit/onboarding',
];

module.exports = {
  mode: 'production',
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    path: path.join(cwd, 'dist', 'with-dll'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  plugins: [
    ...PACKAGES.map(pkgName => {
      let opts = {
        scope: pkgName,
        context: path.join(
          path.dirname(require.resolve(pkgName + '/package.json')),
          'src',
        ),
        manifest: require(pkgName + '/dist/dll/webpack-manifest.json'),
      };
      console.log(opts);
      return new webpack.DllReferencePlugin(opts);
    }),
  ],
};
