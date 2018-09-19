import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
} from '../../styles';

export const calcExtensionWidth = (layout, containerWidth?: number) => {
  switch (layout) {
    case 'full-width':
      const effectiveFullWidth = containerWidth
        ? containerWidth - akEditorBreakoutPadding
        : 0;
      return effectiveFullWidth <= akEditorFullPageMaxWidth
        ? '100%'
        : `${effectiveFullWidth}px`;
    case 'wide':
      return !!!containerWidth || containerWidth <= akEditorWideLayoutWidth
        ? '100%'
        : `${akEditorWideLayoutWidth}px`;
    default:
      return 'inherit';
  }
};
