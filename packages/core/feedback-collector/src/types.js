// @flow

export type SelectValue =
  | 'bug'
  | 'comment'
  | 'suggestion'
  | 'question'
  | 'empty';

export type FormFields = {
  type: SelectValue,
  description: string,
  canBeContacted: boolean,
  enrollInResearchGroup: boolean,
};
