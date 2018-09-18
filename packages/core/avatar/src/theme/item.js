// @flow

export type ThemeItemType = {
  avatarItem?: () => { backgroundColor: string },
  mode?: 'dark' | 'light',
};

export function themeItem(parent: ThemeItemType): ThemeItemType {
  return {
    avatarItem() {
      return {
        backgroundColor: null,
        ...(parent.avatarItem && parent.avatarItem()),
      };
    },
    mode: parent.mode || 'light',
    ...parent,
  };
}
