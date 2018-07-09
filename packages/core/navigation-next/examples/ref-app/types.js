// @flow

type Status = 'TODO' | 'INPROGRESS' | 'DONE';

type IssueType = 'BUG' | 'FEATURE' | 'TASK';

type Issue = {
  name: string,
  status: Status,
  type: IssueType,
};

type Board = {
  name: string,
  issues: Array<Issue>,
};

type Shortcut = {
  name: string,
  url: string,
};

type Page = {
  name: string,
  content: string,
};

export type Project = {
  name: string,
  boards: Array<Board>,
  shortcuts: Array<Shortcut>,
  pages: Array<Page>,
};

type Theme = 'light' | 'dark' | 'custom';

export type DataShape = {
  settings: {
    theme: Theme,
    customText: ?string,
    customBackground: ?string,
  },
  projects: Array<Project>,
};
