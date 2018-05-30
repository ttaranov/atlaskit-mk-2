import * as React from 'react';
import { PureComponent } from 'react';

import {
  HelperTextWrapper,
  ContentWrapper,
  Wrapper,
  EndAdornmentWrapper,
  StartAdornmentAndContent,
} from '../styled/Item';

import { Appearance, ContentRef } from '../types';
import { Placeholder } from '../styled/Placeholder';

export interface Props {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
  appearance?: Appearance;
  helperText?: string;
  contentRef?: ContentRef;
  placeholder?: string;
}

export default class Item extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  renderEndAdornments() {
    return <EndAdornmentWrapper>{this.props.endAdornment}</EndAdornmentWrapper>;
  }

  renderHelperText() {
    const { helperText, appearance } = this.props;

    if (!helperText || appearance === 'inline') {
      return null;
    }

    return <HelperTextWrapper>{helperText}</HelperTextWrapper>;
  }

  renderStartAdornments() {
    return this.props.startAdornment;
  }

  renderContent() {
    const { children, placeholder, contentRef } = this.props;
    if (children) {
      return <ContentWrapper innerRef={contentRef}>{children}</ContentWrapper>;
    }
    return <Placeholder contentEditable={false}>{placeholder}</Placeholder>;
  }

  render() {
    const { appearance } = this.props;

    return (
      <div>
        {this.renderHelperText()}
        <Wrapper theme={{ appearance }}>
          <StartAdornmentAndContent>
            {this.renderStartAdornments()}
            {this.renderContent()}
          </StartAdornmentAndContent>
          {this.renderEndAdornments()}
        </Wrapper>
      </div>
    );
  }
}
