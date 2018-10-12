import * as Loadable from 'react-loadable';

export const ToolbarLoader = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal-editor-core-toolbar" */
    './Toolbar').then(module => module.default),
  loading: () => null,
});
