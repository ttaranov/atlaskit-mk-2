import PickerFacade from './picker-facade';

export const pickerFacadeLoader = (): Promise<typeof PickerFacade> =>
    import(/* webpackChunkName:"@atlaskit-internal_editor-core_picker-facade" */ './picker-facade')
        .then(module => module.default);
