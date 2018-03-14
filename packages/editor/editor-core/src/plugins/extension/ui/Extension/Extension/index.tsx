import * as React from 'react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { MacroProvider } from '../../../../macro';
import { Wrapper } from './styles';
import { Overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';

export interface Props {
  node: PmNode;
  macroProvider?: MacroProvider;
  onClick: (event: React.SyntheticEvent<any>) => void;
  children?: React.ReactNode;
}

export default class Extension extends Component<Props, any> {
  render() {
    const { node, onClick, children } = this.props;

    return (
      <Wrapper onClick={onClick} className={'with-overlay'}>
        <Overlay className="extension-overlay" />
        {children ? children : <ExtensionLozenge node={node} />}
      </Wrapper>
    );
  }
}
