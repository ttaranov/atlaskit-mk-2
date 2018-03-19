import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import Mention from '../ui/Mention';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

export interface Props {
  children?: React.ReactNode;
  view?: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
}

class Button extends React.Component<any> {
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

    console.log('~props~', this.props);

    // Fire our analytics event
    analyticsEvent.fire();

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

const ButtonWithAnalytics = withAnalyticsEvents()(Button);

export default class MentionNode extends React.PureComponent<Props, {}> {
  render() {
    const { node, providerFactory } = this.props;
    const { id, text, accessLevel } = node.attrs;

    return (
      <div>
        <Mention
          id={id}
          text={text}
          accessLevel={accessLevel}
          providers={providerFactory}
        />
        <ButtonWithAnalytics onClick={this.handleOnClick as any}>
          Save
        </ButtonWithAnalytics>
      </div>
    );
  }

  handleOnClick = e => {
    console.log('~button click~');
  };
}
