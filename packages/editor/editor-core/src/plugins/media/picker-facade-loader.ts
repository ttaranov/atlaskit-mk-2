import PickerFacade from './picker-facade';

export default (): Promise<typeof PickerFacade> => {
  return import(/* webpackChunkName:"@atlaskit-internal_editor-core_picker-facade" */

  './picker-facade').then(module => module.default);
};
