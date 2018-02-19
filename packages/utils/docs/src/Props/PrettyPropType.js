// @flow
/* eslint-disable react/no-array-index-key */

import React, { type Node } from 'react';
import { borderRadius, colors, gridSize, themed } from '@atlaskit/theme';
import styled from 'styled-components';
import k2s from 'kind2string';

const Wrapper = styled.code`
  display: inline-block;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: ${gridSize}px;
  margin-top: ${gridSize}px;
`;

const Block = styled.span`
  display: block;
`;

const TypeMinWidth = styled.span`
  display: inline-block;
  min-width: 60px;
`;

const Type = styled.span`
  background-color: ${themed({ light: colors.P50, dark: colors.P500 })};
  border-radius: ${borderRadius}px;
  color: ${themed({ light: colors.P500, dark: colors.P50 })};
  display: inline-block;
  margin: 2px 0;
  padding: 0 0.2em;
`;

// $FlowFixMe
const TypeMeta = styled(Type)`
  background-color: ${themed({ light: colors.N20, dark: colors.DN50 })};
  color: ${colors.subtleText};
`;

// $FlowFixMe
const StringType = styled(Type)`
  background-color: ${themed({ light: colors.G50, dark: colors.G500 })};
  color: ${themed({ light: colors.G500, dark: colors.G100 })};
`;

const Required = styled.span`
  color: ${themed({ light: colors.R500, dark: colors.R300 })};
`;

const Outline = styled.span`
  color: ${colors.subtleText};
  line-height: 1;
`;

const SIMPLE_TYPES = [
  'array',
  'boolean',
  'number',
  'string',
  'symbol',
  'node',
  'element',
  'custom',
  'any',
  'void',
  'mixed',
];

/* eslint-disable no-use-before-define */
/* eslint-disable prefer-rest-params */
function printComplexType(type, depth) {
  if (typeof type === 'object' && !SIMPLE_TYPES.includes(type.kind)) {
    return prettyConvert(type, depth);
  }
  return null;
}
/* eslint-enable no-use-before-define */
/* eslint-enable prefer-rest-params */

function Indent(props: { children: Node }) {
  return <div style={{ paddingLeft: '1.3em' }}>{props.children}</div>;
}
// const printFunc = type => null;

type PrettyPropTypeProps = {
  type: Object,
};

const converters = {
  string: type => {
    if (type.value != null) {
      return <StringType>{k2s.convert(type)}</StringType>;
    }
    return <Type>{k2s.convert(type)}</Type>;
  },
  nullable: (type, depth) => {
    return prettyConvert(type.arguments, depth);
  },
  generic: (type, depth) => {
    if (type.value && type.typeParams) {
      // As Flow does not know what the keyword Array<T> means, we're doing a check here for generic types with a nominal value of 'Array'
      // If a type meets this criteria, we print out its contents as per below.
      return (
        <span>
          <TypeMeta>
            {k2s.convert(type.value)} <Outline>{'<'}</Outline>
          </TypeMeta>
          <Indent>
            {type.typeParams.params.map((param, i) => (
              <span key={i}>{prettyConvert(param, depth)}</span>
            ))}
          </Indent>
          <TypeMeta>
            <Outline>{'>'}</Outline>
          </TypeMeta>
        </span>
      );
    }
    return prettyConvert(k2s.resolveFromGeneric(type));
  },
  object: (type, depth) => (
    <span>
      <TypeMeta>
        Shape <Outline>{'{'}</Outline>
      </TypeMeta>
      <Indent>
        {type.members.map(prop => {
          // handling this badly. It should be recursive. Shipit work on kindToString
          // should simplify how we think about PrettyPropType. If this is unchanged
          // after 2018-02-12, blame Ben Conolly
          if (prop.kind === 'spread') {
            const nestedObj = k2s.resolveFromGeneric(prop.value);
            return nestedObj.members.map(newProp =>
              prettyConvert(newProp, depth),
            );
          }
          return prettyConvert(prop, depth);
        })}
      </Indent>
      <TypeMeta>
        <Outline>{'}'}</Outline>
      </TypeMeta>
    </span>
  ),
  property: (type, depth) => (
    <div key={k2s.convert(type.key)}>
      <TypeMinWidth>
        <Type>{k2s.convert(type.key)}</Type>
      </TypeMinWidth>{' '}
      {type.value.kind !== 'generic' ? type.value.kind : ''}
      {type.optional ? null : <Required> required</Required>}{' '}
      {printComplexType(type.value, depth)}
    </div>
  ),
  union: (type, depth) => (
    <span>
      <TypeMeta>
        One of <Outline>{'('}</Outline>
      </TypeMeta>
      <Indent>
        {type.types.map((t, i) => (
          <Block key={i}>{prettyConvert(t, depth + 1)}</Block>
        ))}
      </Indent>
      <TypeMeta>
        <Outline>{')'}</Outline>
      </TypeMeta>
    </span>
  ),
};

const prettyConvert = (type, depth = 1) => {
  if (!type) {
    return '';
  }

  const converter = converters[type.kind];
  if (!converter) {
    return <Type>{k2s.convert(type)}</Type>;
  }
  return converter(type, depth);
};

export default function PrettyPropType(props: PrettyPropTypeProps) {
  // any instance of returning null means we are confident the information will
  // be displayed elsewhere so we do not need to also include it here
  let type = props.type;
  if (type.kind === 'generic') {
    type = k2s.resolveFromGeneric(props.type);
  }
  if (SIMPLE_TYPES.includes(type.kind)) return null;
  if (
    type.kind === 'nullable' &&
    SIMPLE_TYPES.includes(props.type.arguments.kind)
  ) {
    return null;
  }
  return <Wrapper>{prettyConvert(type)}</Wrapper>;
}
