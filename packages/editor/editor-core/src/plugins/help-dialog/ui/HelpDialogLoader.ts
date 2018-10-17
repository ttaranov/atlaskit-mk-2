import * as Loadable from 'react-loadable';

export const HelpDialogLoader = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal-editor-core-helpdialog" */
    './index').then(module => module.default),
  loading: () => null,
});
