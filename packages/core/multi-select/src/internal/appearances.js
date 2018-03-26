// @flow
// =============================================================
// NOTE: Duplicated in ../index and ../StatelessMultiSelect until
// docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

export const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

const appearancesMap = {
  default: 'standard',
  subtle: 'subtle',
};

const tagAppearances = {
  default: 'default',
  rounded: 'rounded',
};

export const mapAppearanceToFieldBase = (appearance: string) =>
  appearancesMap[appearance];

export const mapAppearanceToTag = (appearance: ?string) =>
  appearance ? tagAppearances[appearance] : undefined;
