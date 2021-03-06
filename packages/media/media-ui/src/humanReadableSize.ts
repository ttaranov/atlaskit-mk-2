import * as bytes from 'bytes';

// tslint:disable-next-line:no-bitwise
const ONE_MEGABYTE_IN_BYTES = 1 << 20;

/**
 * Takes a media (file) size in bytes and returns a human readable string
 */
export function toHumanReadableMediaSize(size: number): string {
  const decimalPlaces = size < ONE_MEGABYTE_IN_BYTES ? 0 : 1;
  return bytes
    .format(size, { unitSeparator: ' ', decimalPlaces })
    .toUpperCase();
}
