// @flow
import React, { Component } from 'react';
import AudioCircleIcon from '@atlaskit/icon/glyph/audio-circle';
import { ObjectResult, ResultBase, ResultItemGroup } from '../src';
import { randomJiraIconUrl } from './utils/mockData';

const defaultProps = {
  resultId: 'result_id',
  type: 'base',
  isSelected: false,
  isCompact: false,
  onClick: () => {},
};

/*eslint-disable */
// too many violations in this component
class AlertLinkComponent extends Component<*> {
  handleClick = () => {
    const { href } = this.props;
    alert(`href: ${href}`);
  };

  render() {
    const { className, children } = this.props;

    return (
      <span onClick={this.handleClick} className={className}>
        {children}
      </span>
    );
  }
}
/*eslint-enable */

// eslint-disable-next-line
export default class extends Component<*> {
  render() {
    return (
      <div>
        <h3>Custom result types</h3>
        <p>
          If the preset result types do not support the shape required,
          ResultBase can be used directly or composed to help create QuickSearch
          compatible results. Fully custom result types can be created from
          scratch and still be QuickSearch compatible as long as they implement
          the required props.
        </p>

        <ResultItemGroup title="Object examples">
          <ResultBase
            {...defaultProps}
            text="I don't even have an icon or subText"
          />
          <ResultBase
            {...defaultProps}
            caption="#:notsureif:"
            icon={
              <AudioCircleIcon
                label="a"
                size="large"
                primaryColor="#FFEBE5"
                secondaryColor="RebeccaPurple"
              />
            }
            text="Cronenberg result"
            subText="Anything goes!"
          />
        </ResultItemGroup>

        <h3>Custom linkComponent</h3>
        <p>
          You can provide a custom linkComponent instead of the default a tag,
          for example when you want to integrate with react-router.
        </p>
        <ResultItemGroup title="Link component that will alert">
          <ObjectResult
            {...defaultProps}
            name="Click me!"
            avatarUrl={randomJiraIconUrl()}
            objectKey="AK-007"
            href="jira.com"
            containerName="Search'n'Smarts"
            linkComponent={AlertLinkComponent}
          />
        </ResultItemGroup>
      </div>
    );
  }
}
