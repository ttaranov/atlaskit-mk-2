import * as React from 'react';
import { KeyboardEvent, PureComponent } from 'react';
import styled from 'styled-components';
import { ActivityProvider, ActivityItem } from '@atlaskit/activity';

import { analyticsService } from '../../../../analytics';
import PanelTextInput from '../../../../ui/PanelTextInput';
import RecentList from './RecentList';
import { FloatingToolbar } from '../styles';
import { getNearestNonTextNode } from '../../../../ui/FloatingToolbar';

const Container = styled.span`
  width: 420px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export interface Props {
  onBlur?: (text: string) => void;
  onSubmit?: (href: string, text?: string) => void;

  target: Node;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;

  autoFocus?: boolean;
  placeholder: string;
  activityProvider: Promise<ActivityProvider>;
}

export interface State {
  activityProvider?: ActivityProvider;
  items: Array<ActivityItem>;
  selectedIndex: number;
  text: string;
  isLoading: boolean;
}

export default class RecentSearch extends PureComponent<Props, State> {
  state = {
    selectedIndex: -1,
    isLoading: false,
    text: '',
    items: [],
  } as State;

  async resolveProvider() {
    const activityProvider = await this.props.activityProvider;
    this.setState({ activityProvider });
    return activityProvider;
  }

  async componentDidMount() {
    const activityProvider = await this.resolveProvider();
    this.loadRecentItems(activityProvider);
  }

  private async loadRecentItems(activityProvider: ActivityProvider) {
    try {
      this.setState({ isLoading: true });
      this.setState({ items: limit(await activityProvider.getRecentItems()) });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private updateInput = async (input: string) => {
    this.setState({ text: input });

    if (this.state.activityProvider) {
      if (input.length === 0) {
        this.setState({
          items: limit(await this.state.activityProvider.getRecentItems()),
          selectedIndex: -1,
        });
      } else {
        this.setState({
          items: limit(await this.state.activityProvider.searchRecent(input)),
          selectedIndex: 0,
        });
      }
    }
  };

  render() {
    const {
      target,
      popupsMountPoint,
      popupsBoundariesElement,
      placeholder,
    } = this.props;
    const { items, isLoading, selectedIndex } = this.state;

    return (
      <FloatingToolbar
        target={getNearestNonTextNode(target)!}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        fitWidth={420}
        fitHeight={350}
        zIndex={500}
        offset={[0, 12]}
        className="recent-search"
      >
        <Container>
          <PanelTextInput
            placeholder={placeholder}
            autoFocus={true}
            onSubmit={this.handleSubmit}
            onChange={this.updateInput}
            onBlur={this.handleBlur}
            onCancel={this.handleBlur}
            onKeyDown={this.handleKeyDown}
          />
          <RecentList
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelect={this.handleSelected}
            onMouseMove={this.handleMouseMove}
          />
        </Container>
      </FloatingToolbar>
    );
  }

  private handleSelected = (href: string, text: string) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(href, text);
      this.trackAutoCompleteAnalyticsEvent(
        'atlassian.editor.format.hyperlink.autocomplete.click',
      );
    }
  };

  private handleMouseMove = (objectId: string) => {
    const { items } = this.state;

    if (items) {
      const index = findIndex(items, item => item.objectId === objectId);
      this.setState({
        selectedIndex: index,
      });
    }
  };

  private handleSubmit = () => {
    const { items, text, selectedIndex } = this.state;

    // add the link selected in the dropdown if there is one, otherwise submit the value of the input field
    if (items && items.length > 0 && selectedIndex > -1) {
      const item = items[selectedIndex];
      if (this.props.onSubmit) {
        this.props.onSubmit(item.url, item.name);
        this.trackAutoCompleteAnalyticsEvent(
          'atlassian.editor.format.hyperlink.autocomplete.keyboard',
        );
      }
    } else if (text && text.length > 0) {
      if (this.props.onSubmit) {
        this.props.onSubmit(text);
        this.trackAutoCompleteAnalyticsEvent(
          'atlassian.editor.format.hyperlink.autocomplete.notselected',
        );
      }
    }
  };

  private handleKeyDown = (e: KeyboardEvent<any>) => {
    const { items, selectedIndex } = this.state;
    if (!items || !items.length) {
      return;
    }

    if (e.keyCode === 40) {
      // down
      e.preventDefault();
      this.setState({
        selectedIndex: (selectedIndex + 1) % items.length,
      });
    } else if (e.keyCode === 38) {
      // up
      e.preventDefault();
      this.setState({
        selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : items.length - 1,
      });
    }
  };

  private handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur(this.state.text);
    }
  };

  private trackAutoCompleteAnalyticsEvent(name: string) {
    const numChars = this.state.text ? this.state.text.length : 0;

    analyticsService.trackEvent(name, { numChars: numChars });
  }
}

const findIndex = (array: any[], predicate: (item: any) => boolean): number => {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }
    return false;
  });

  return index;
};

const limit = (items: Array<ActivityItem>) => {
  return items.slice(0, 5);
};
