import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
} from '../../styles';

export const calcExtensionWidth = (layout, containerWidth: number) => {
  switch (layout) {
    case 'full-width':
      return containerWidth <= akEditorFullPageMaxWidth
        ? '100%'
        : `${containerWidth}px`;
    case 'wide':
      return containerWidth <= akEditorWideLayoutWidth
        ? '100%'
        : `${akEditorWideLayoutWidth}px`;
    default:
      return 'inherit';
  }
};
