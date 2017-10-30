import * as React from 'react';
import { KeyboardEvent, PureComponent } from 'react';
import styled from 'styled-components';
import { ActivityProvider, ActivityItem } from '@atlaskit/activity';

import { HyperlinkState } from '../../plugins/hyperlink';
import PanelTextInput from '../PanelTextInput';
import { EditorView } from 'prosemirror-view';
import RecentList from './RecentList';

// tslint:disable-next-line:variable-name
const Container = styled.span`
  width: 420px;
  padding-left: 4px;
  display: flex;
  flex-direction: column;
`;

export interface Props {
  pluginState: HyperlinkState;
  editorView: EditorView;
  activityProvider: Promise<ActivityProvider>;
}

export interface State {
  activityProvider?: ActivityProvider;
  items?: Array<ActivityItem>;
  selectedIndex: number;
  input?: string;
  linkAdded: boolean;
  isLoading: boolean;
}

export default class RecentSearch extends PureComponent<Props, State> {
  state: State = {
    selectedIndex: -1,
    linkAdded: false,
    isLoading: false
  };

  async resolveProvider() {
    const activityProvider = await this.props.activityProvider;

    this.setState({
      activityProvider: activityProvider
    });

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
    this.setState({
      input: input
    });

    if (this.state.activityProvider) {
      if (input.length === 0) {
        this.setState({
          items: limit(await this.state.activityProvider.getRecentItems()),
          selectedIndex: -1
        });
      } else {
        this.setState({
          items: limit(await this.state.activityProvider.searchRecent(input)),
          selectedIndex: 0
        });
      }
    }
  }

  render() {
    const { items, isLoading, selectedIndex } = this.state;

    return (
      <Container>
        <PanelTextInput
          placeholder="Paste link or search recently viewed"
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
          onSelect={this.addLink}
          onMouseMove={this.handleMouseMove}
        />
      </Container>
    );
  }

  private handleMouseMove = (objectId: string) => {
    const { items } = this.state;

    if (items) {
      const index = findIndex(items, (item) => item.objectId === objectId);
      this.setState({
        selectedIndex: index
      });
    }
  }

  private handleSubmit = () => {
    const { items, input, selectedIndex } = this.state;

    // add the link selected in the dropdown if there is one, otherwise submit the value of the input field
    if (items && items.length > 0 && selectedIndex > -1) {
      const item = items[selectedIndex];
      this.addLink(item.url, item.name);
    } else if (input && input.length > 0) {
      this.addLink(input);
    }
  }

  private handleKeyDown = (e: KeyboardEvent<any>) => {
    const { items, selectedIndex } = this.state;
    if (!items) {
      return;
    }

    if (e.keyCode === 40) { // down
      e.preventDefault();
      this.setState({
        selectedIndex: (selectedIndex + 1) % items.length
      });
    } else if (e.keyCode === 38) { // up
      e.preventDefault();
      this.setState({
        selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : items.length - 1
      });
    }
  }

  private handleBlur = () => {
    const { editorView, pluginState } = this.props;
    const { linkAdded } = this.state;

    if (linkAdded || editorView.state.selection.empty && !pluginState.active) {
      pluginState.hideLinkPanel();
      editorView.focus();
    } else {
      pluginState.removeLink(editorView);
    }
  }

  private addLink = (href: string, text?: string) => {
    const { editorView, pluginState } = this.props;

    if (editorView.state.selection.empty) {
      pluginState.addLink({ href, text }, editorView);
    } else {
      pluginState.updateLink({ href }, editorView);
    }

    this.setState({
      linkAdded: true
    }, () => {
      editorView.focus();
    });
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
