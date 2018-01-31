import { toolbarSize } from './styles';

const TABLE_PADDING = 10;

export const getLineMarkerWidth = (
  tableElement: HTMLElement,
  scroll: number,
): number => {
  const { parentElement, offsetWidth } = tableElement;
  const diff = offsetWidth - parentElement!.offsetWidth;
  const scrollDiff = scroll - diff > 0 ? scroll - diff : 0;
  return Math.min(
    offsetWidth + toolbarSize,
    parentElement!.offsetWidth + TABLE_PADDING - scrollDiff,
  );
};
