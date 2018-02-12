/// <reference types="react" />
import * as React from 'react';
export interface Props {
  children?: React.ReactNode | React.ReactNode[];
}
export default class Scrollable extends React.PureComponent<Props, {}> {
  private scrollableDiv;
  reveal: (child: any) => void;
  private handleRef;
  render(): JSX.Element;
}
