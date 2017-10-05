// @flow
import React, { type Node } from 'react';

// type BoltQueryFile = {
//   filePath: string,
//   fileContents: string,
// };

// export type Example = {
//   codeText?: string,
//   CodeNode?: React.Component<any>,
// };

// export type Doc = {
//   filePath: string,
//   fileContents: string,
// };

// export type Packages = {
//   [group: string]: Array<Package>,
// }

// export type Package = {
//   group: string,
//   name: string,
//   description: string,
//   version: string,
//   relativePath: string,
//   docs: Array<BoltQueryFile>,
// }

export type NavGroupItem = {
  to: string,
  title: string,
  isSelected?: (string, string) => boolean,
  icon?: Node,
}

export type NavGroup = {
  title?: string,
  items: Array<NavGroupItem>
}

// ...

// export type SiteDataDoc = {
//   id: string,
//   title: string,
//   component: () => Node,
// };
//
// export type SiteDataPackage = {
//   id: string,
//   title: string,
//   docs: Array<Doc>
// };
//
// export type SiteDataGroup = {
//   id: string,
//   title: string,
//   changelog: () => string,
//   packages: Array<SiteDataPackage>
// };


export type File = {
  type: 'file',
  id: string,
  exports: () => Promise<mixed>,
  contents: () => Promise<string>,
};

export type Directory = {
  type: 'dir',
  id: string,
  children: Array<File | Directory>,
};
