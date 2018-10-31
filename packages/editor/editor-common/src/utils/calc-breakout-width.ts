import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
} from '../styles';

export const calcBreakoutWidth = (layout, containerWidth: number) => {
  switch (layout) {
    case 'full-width':
      const effectiveFullWidth = containerWidth - akEditorBreakoutPadding;
      return effectiveFullWidth <= akEditorFullPageMaxWidth
        ? '100%'
        : `${effectiveFullWidth}px`;
    case 'wide':
      return containerWidth <= akEditorWideLayoutWidth
        ? '100%'
        : `${akEditorWideLayoutWidth}px`;
    default:
      return 'inherit';
  }
};
