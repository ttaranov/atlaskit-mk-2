import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
} from '../../styles';

/** Full page padding, TODO: unify the padding values */
const FULL_PAGE_PADDING = 66;

export const calcExtensionWidth = (layout, containerWidth: number) => {
  switch (layout) {
    case 'full-width':
      const effectiveFullWidth = containerWidth - FULL_PAGE_PADDING;
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
