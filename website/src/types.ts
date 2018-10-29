export type NavGroupItem = {
  external?: any;
  to: string;
  title: string;
  isSelected?: (param1: string, param2: string) => boolean;
  isCompact?: boolean;
  iconSelected?: boolean;
  icon?: React.ReactNode;
  items?: Array<NavGroup>;
};

export type NavGroup = {
  title?: string;
  items: Array<NavGroupItem>;
};

export type File = {
  type: 'file';
  id: string;
  exports: () => Promise<Object>;
  contents: () => Promise<string>;
};

export type Directory = {
  type: 'dir';
  id: string;
  children: Array<File | Directory>;
};

export type RouterMatch = {
  params: {
    [key: string]: string;
  };
};
