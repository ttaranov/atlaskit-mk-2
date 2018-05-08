import { akEditorTableToolbarSize } from '../../../../styles';

const TABLE_PADDING = akEditorTableToolbarSize - 1;

export const getLineMarkerWidth = (
  tableElement: HTMLElement,
  scroll: number,
): number => {
  const { parentElement, offsetWidth } = tableElement;
  const diff = offsetWidth - parentElement!.offsetWidth;
  const scrollDiff = scroll - diff > 0 ? scroll - diff : 0;
  return Math.min(
    offsetWidth + akEditorTableToolbarSize,
    parentElement!.offsetWidth + TABLE_PADDING - scrollDiff,
  );
};
