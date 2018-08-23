import * as React from 'react';
import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import { akColorB100 } from '@atlaskit/util-shared-styles';

export const Link: ComponentClass<
  HTMLAttributes<{}> & { isActive: boolean }
> = styled.div`
  padding: 5px;
  cursor: pointer;
  border-bottom: ${(props: { isActive: number }) =>
    props.isActive ? `2px solid ${akColorB100}` : 'none'};
  display: inline-block;
  margin-right: 10px;
`;

interface Tab {
  id: string;
  name: string;
}

interface TabsContent {
  tabId: string;
  content: any;
}

interface Props {
  editable: boolean;
  tabs: Tab[];
  tabsContent: TabsContent[];
  content: any;
  syncEditorState: (parameters: any, content: any) => void;
  isSelected: () => boolean;
}

interface State {
  activeTabId: string;
}

export class TabsApp extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { tabs } = this.props;

    this.state = {
      activeTabId: tabs[0].id,
    };
  }

  render() {
    const { tabs } = this.props;
    const { activeTabId } = this.state;

    return (
      <div contentEditable={false}>
        {tabs.map(tab => (
          <Link
            key={tab.id}
            // appearance={tab.id === activeTabId ? 'primary' : 'default'}
            onClick={() => this.handleSelectTab(tab.id)}
            isActive={tab.id === activeTabId}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    );
  }

  private handleSelectTab = (activeTabId: string) => {
    const { tabs, tabsContent } = this.props;
    if (activeTabId === this.state.activeTabId || !this.props.isSelected()) {
      return;
    }

    const newTabsContent = [...tabsContent];
    // take the content from bodiedExtension and save it in attributes
    for (let i = 0, count = newTabsContent.length; i < count; i++) {
      if (newTabsContent[i].tabId === this.state.activeTabId) {
        newTabsContent[i] = {
          ...tabsContent[i],
          content: this.props.content.toJSON(),
        };
        break;
      }
    }

    const nextTabContent = this.getTabContentById(activeTabId);

    // sync with Editor by replacing the node
    const parameters = {
      tabs,
      tabsContent: newTabsContent,
    };
    this.props.syncEditorState(parameters, nextTabContent);

    this.setState({ activeTabId });
  };

  private getTabContentById = (tabId: string) => {
    const { tabsContent } = this.props;
    for (let i = 0, count = tabsContent.length; i < count; i++) {
      if (tabsContent[i].tabId === tabId) {
        return tabsContent[i].content;
      }
    }
  };
}
