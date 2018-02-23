import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  background: #f5f5f5;
  position: relative;
`;

// tslint:disable-next-line:variable-name
const Overlay = styled.div`
  border: ${props =>
    props.isSelected ? '1px solid black' : '1px dashed #ccc'};
  background: ${props => (props.isSelected ? 'rgba(0, 0, 0, .15)' : 'none')};
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
`;

export type Props = {
  isSelected: Boolean;
  node: any;
  onSelect: any;
};

export default class ProvidedExtensionComponent extends React.Component<
  Props,
  {}
> {
  render() {
    const { isSelected, node, onSelect, children } = this.props;

    const { extensionKey, parameters } = node;
    const { macroParams } = parameters;
    const text =
      macroParams &&
      Object.keys(macroParams)
        .map(key => macroParams[key].value)
        .join(' - ');

    return (
      <Wrapper onClick={onSelect}>
        <Overlay isSelected={isSelected} />
        <strong>{extensionKey} extension</strong>
        ({text}) (isSelected={isSelected})
        {children}
      </Wrapper>
    );
  }
}
