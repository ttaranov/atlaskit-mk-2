// @flow

export type FormFields = {
  type: 'bug' | 'comment' | 'suggestion' | 'question' | 'empty',
  description: string,
  canBeContacted: boolean,
  enrollInResearchGroup: boolean,
};
