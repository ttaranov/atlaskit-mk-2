// @flow
import * as React from 'react';
import styled from 'styled-components';

const primitiveValues = ['string', 'number', 'boolean', 'any', 'mixed'];

const PropRequired = styled.span`
  color: #BF2600;
  margin-right: 10px;
`;

const PropsDefinitionWrapper = styled.div`
  border-top: 1px solid #ccc;
  margin-top: 10px;
`;

const PropWrapper = styled.div`
  margin: 10px;
`;

const PropName = styled.span`
  text-transform: capitalize;
  margin-right: 10px;
`;

const PropDefinition = styled.span`
  border: 1px solid;
  padding: 2px 5px;
`;

type PropsProps = {
  props: any,
};

const renderProperty = (prop) => {
  const {key, value, optional} = prop;
  let propInfo;

  if (value) {
    const {kind} = value;
    if (kind === 'function') {
      const returnType = value.returnType.kind;
      const params = value.parameters.map(p => p.kind).join(', ');

      propInfo = `(${params}) => ${returnType}`;
    }

    if (kind === 'nullable') {
      // ...
    }

    if (primitiveValues.includes(kind)) {
      propInfo = kind;
    }

    if (kind === 'union') {
      propInfo = value.types.map(type => {
        return type.value || type.kind;
      }).join(' | ');
    }

    if (kind === 'object') {
      propInfo = value.props.map(prop => {
        return renderProperty(prop);
      });
    }
  }

  return (
    <PropWrapper key={key}>
      <PropName>
        {key}:
      </PropName>
      {!optional && <PropRequired>Required</PropRequired>}
      <PropDefinition>
        {propInfo}
      </PropDefinition>
    </PropWrapper>
  );
};

export default class Props extends React.Component<PropsProps> {
  render() {
    const {props} = this.props;
    let propDefinitions;

    if (props && props.classes) {
      propDefinitions = props.classes.map(klass => {
        return klass.props.map(prop => {
          return renderProperty(prop);
        });
      });
    }

    return (
      <PropsDefinitionWrapper>
        {propDefinitions}
      </PropsDefinitionWrapper>
    );
  }
}
