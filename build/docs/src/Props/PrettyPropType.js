// @flow
/* eslint-disable react/no-array-index-key */

import React, { Component, type Node } from 'react';
import { borderRadius, colors, gridSize, themed } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import styled, { css } from 'styled-components';
import convert, { resolveFromGeneric } from 'kind2string';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';

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

const Collapse = ({ height, isCollapsed, innerRef, ...props }) => {
  return (
    <div
      ref={innerRef}
      style={{
        height: isCollapsed ? 0 : height,
        overflow: isCollapsed ? 'hidden' : null,
        transition: 'height 260ms cubic-bezier(0.2, 0, 0, 1)',
      }}
      {...props}
    />
  );
};

class Toggle extends Component {
  static defaultProps = {
    beforeCollapse: () => null,
    afterCollapse: () => null,
    beginClosed: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: this.props.beginClosed,
      contentHeight: 0,
    };
  }

  componentDidMount() {
    const contentHeight = this.content.scrollHeight;
    this.setState({ contentHeight });
  }

  componentWillReceiveProps(props) {
    const contentHeight = this.content.scrollHeight;
    if (contentHeight !== this.state.contentHeight) {
      this.setState({ contentHeight });
    }
  }

  getContent = ref => {
    if (!ref) return;
    this.content = ref;
  };

  toggleCollapse = () => {
    const contentHeight = this.content.scrollHeight;
    this.setState({ contentHeight, isCollapsed: !this.state.isCollapsed });
  };

  render() {
    let { type, beforeCollapse, children, afterCollapse } = this.props;
    let { isCollapsed, contentHeight } = this.state;

    return (
      <div>
        {beforeCollapse(isCollapsed, this.toggleCollapse)}
        <Collapse
          isCollapsed={isCollapsed}
          duration={500}
          height={contentHeight}
          innerRef={this.getContent}
        >
          {children}
        </Collapse>
        {afterCollapse(isCollapsed, this.toggleCollapse)}
      </div>
    );
  }
}

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
  // Experimenting with toggle here, ran into Issues, however this needs to be
  // tackled at some point.
  // Ref measurements were off with nested Toggles, basically
  return (
    // <Toggle
    //   beforeCollapse={(isCollapsed, toggleCollapse) => (
    //     <Button onClick={toggleCollapse}><ChevronDownIcon label="expandIcon"/></Button>
    //   )}
    // >
    <div style={{ paddingLeft: '1.3em' }}>{props.children}</div>
    // </Toggle>
  );
}
// const printFunc = type => null;

type PrettyPropTypeProps = {
  type: Object,
  shouldCollapse?: boolean,
};

const converters = {
  intersection: type =>
    type.types.reduce(
      (acc, t, i) =>
        i < type.types.length - 1
          ? [
              ...acc,
              <span key={i}>{prettyConvert(t)}</span>,
              <div key={`divider-${i}`}>&</div>,
            ]
          : [...acc, <span key={i}>{prettyConvert(t)}</span>],
      [],
    ),
  string: type => {
    if (type.value != null) {
      return <StringType>{convert(type)}</StringType>;
    }
    return <Type>{convert(type)}</Type>;
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
            {convert(type.value)} <Outline>{'<'}</Outline>
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
    return prettyConvert(resolveFromGeneric(type));
  },
  object: (type, depth) => (
    <span>
      <TypeMeta>
        Shape <Outline>{'{'}</Outline>
      </TypeMeta>
      <Indent>
        {type.members.map(prop => {
          if (prop.kind === 'spread') {
            const nestedObj = resolveFromGeneric(prop.value);
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
    <div key={convert(type.key)}>
      <TypeMinWidth>
        <Type>{convert(type.key)}</Type>
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
    return <Type>{convert(type)}</Type>;
  }
  return converter(type, depth);
};

export default class PrettyPropType extends Component<PrettyPropTypeProps, *> {
  render() {
    let { shouldCollapse, type } = this.props;
    // any instance of returning null means we are confident the information will
    // be displayed elsewhere so we do not need to also include it here
    if (type.kind === 'generic') {
      type = resolveFromGeneric(type);
    }
    if (SIMPLE_TYPES.includes(type.kind)) return null;
    if (
      type.kind === 'nullable' &&
      SIMPLE_TYPES.includes(type.arguments.kind)
    ) {
      return null;
    }
    return shouldCollapse ? (
      <Toggle
        beginClosed
        afterCollapse={(isCollapsed, toggleCollapse) => (
          <div>
            <Button
              iconBefore={
                isCollapsed ? (
                  <ChevronDownIcon label="expandIcon" />
                ) : (
                  <ChevronUpIcon label="collapseIcon" />
                )
              }
              onClick={toggleCollapse}
            >
              {isCollapsed ? 'Expand Prop Shape' : 'Hide Prop Shape'}
            </Button>
          </div>
        )}
      >
        <Wrapper>{prettyConvert(type)}</Wrapper>
      </Toggle>
    ) : (
      <Wrapper>{prettyConvert(type)}</Wrapper>
    );
  }
}
