// @flow
import React, { type ComponentType } from 'react';
import styled from 'styled-components';
import { colors, gridSize, themed } from '@atlaskit/theme';
import { AkCodeBlock } from '@atlaskit/code';
import ToggleIcon from '@atlaskit/icon/glyph/code';
import ErrorBoundary from './ErrorBoundary';
import replaceSrc from './replaceSrc';

type Props = {
  Component: ComponentType<any>,
  language: string,
  source: string,
  title: string,
  packageName: string,
};

type State = {
  isSourceVisible: boolean,
  isHover: boolean,
};

export default class Example extends React.Component<Props, State> {
  static defaultProps = {
    language: 'javascript',
  };

  state = {
    isSourceVisible: false,
    isHover: false,
  };

  toggleSource = () => {
    this.setState({ isSourceVisible: !this.state.isSourceVisible });
  };

  onError = (error: Error, info: any) => {
    console.error(error);
    console.error(info);
  };

  render() {
    const { Component, source, language, title, packageName } = this.props;
    const { isHover, isSourceVisible } = this.state;
    const toggleLabel = isSourceVisible
      ? 'Hide Code Snippet'
      : 'Show Code Snippet';

    const state = isHover ? 'hover' : 'normal';
    const mode = isSourceVisible ? 'open' : 'closed';

    return (
      <Wrapper state={state} mode={mode}>
        <Toggle
          onClick={this.toggleSource}
          onMouseOver={() => this.setState({ isHover: true })}
          onMouseOut={() => this.setState({ isHover: false })}
          title={toggleLabel}
          mode={mode}
        >
          <ToggleTitle mode={mode}>{title}</ToggleTitle>
          <ToggleIcon label={toggleLabel} />
        </Toggle>

        {isSourceVisible ? (
          <CodeWrapper>
            <AkCodeBlock
              text={packageName ? replaceSrc(source, packageName) : source}
              language={language}
              showLineNumbers={false}
            />
          </CodeWrapper>
        ) : null}
        <Showcase>
          <ErrorBoundary onError={this.onError}>
            <Component />
          </ErrorBoundary>
        </Showcase>
      </Wrapper>
    );
  }
}

const TRANSITION_DURATION = '200ms';

const exampleBackgroundColor = {
  open: themed('state', {
    normal: { light: colors.N30, dark: colors.N700 },
    hover: { light: colors.N40, dark: colors.N600 },
  }),
  closed: themed('state', {
    normal: { light: colors.N20, dark: colors.DN50 },
    hover: { light: colors.N40, dark: colors.DN60 },
  }),
};
const toggleColor = themed('mode', {
  closed: { light: colors.N600, dark: colors.DN100 },
  open: { light: colors.N600, dark: colors.DN100 },
});

const Wrapper = styled.div`
  background-color: ${p => exampleBackgroundColor[p.mode]};
  border-radius: 5px;
  color: ${toggleColor};
  margin-top: 20px;
  padding: 0 ${gridSize}px ${gridSize}px;
  transition: background-color ${TRANSITION_DURATION};
`;

export const Toggle = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: ${gridSize}px;
  transition: color ${TRANSITION_DURATION}, fill ${TRANSITION_DURATION};
`;

// NOTE: use of important necessary to override element targeted headings
export const ToggleTitle = styled.h4`
  color: ${toggleColor} !important;
  margin: 0;
`;

const Showcase = styled.div`
  background-color: ${colors.background};
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: ${gridSize}px;
`;

const CodeWrapper = styled.div`
  margin: 0 0 ${gridSize}px;
`;
