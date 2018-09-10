// @flow

import React, { Component } from 'react';

import {
  ContainerHeader,
  GlobalNav,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  SortableSection,
} from '../src';

// const Div = ({ draggableProps, innerRef, ...props }) => {
//   console.log('Div ref', innerRef);
//   return <div ref={innerRef} {...draggableProps} {...props} />;
// };

const GlobalNavigation = () => (
  <GlobalNav primaryItems={[]} secondaryItems={[]} />
);
const getDefaultItems = (from = 0, to = 0) => {
  const items = {
    dashboards: {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Dashboards',
    },
    projects: {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Projects',
    },
    settings: {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Settings',
    },
    backlog: {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Backlog',
    },
    'active-sprint': {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Active Sprint',
    },
    'issues-and-filters': {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Issues and filters',
    },
    reports: {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Reports',
    },
    'viewed-recently': {
      // component: Div,
      onClick: e => {
        console.log('was clicked', e);
      },
      text: 'Viewed Recently',
    },
  };

  // get ids
  if (from || to) {
    return Object.keys(items).splice(from, to);
  }

  return items;
};

type Props = {
  items: Array<Object>,
};
type State = {
  groups: Array<Object>,
  showContainer: boolean,
};

export default class Example extends Component<Props, State> {
  static defaultProps = {
    items: getDefaultItems(),
  };
  state = {
    groups: {
      first: { heading: 'First', itemIds: getDefaultItems(0, 4) },
      second: { heading: 'Second', itemIds: getDefaultItems(4, 8) },
    },
    groupIds: ['first', 'second'],
    showContainer: true,
  };

  onDragEnd = (groups, result) => {
    console.log('Example onDragEnd:', result);
    this.setState({ groups });
  };

  toggleContainerNav = () => {
    this.setState(state => ({ showContainer: !state.showContainer }));
  };

  renderNavigation = () => {
    return (
      <div css={{ padding: '16px 0' }}>
        <Section>
          {({ css }) => (
            <div css={css}>
              <ContainerHeader
                before={itemState => (
                  <ItemAvatar itemState={itemState} appearance="square" />
                )}
                text="Container title"
                subText="Container description"
              />
            </div>
          )}
        </Section>
        <SortableSection
          items={this.props.items}
          groups={this.state.groups}
          groupIds={this.state.groupIds}
          onDragEnd={this.onDragEnd}
        />
      </div>
    );
  };

  render() {
    const { showContainer } = this.state;

    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={GlobalNavigation}
          productNavigation={() => null}
          containerNavigation={showContainer ? this.renderNavigation : null}
        >
          <div css={{ padding: 40 }}>
            <h4>Sortable Items</h4>
            <p>
              <label htmlFor="show-container-nav">
                <input
                  checked={showContainer}
                  id="show-container-nav"
                  onChange={this.toggleContainerNav}
                  type="checkbox"
                />{' '}
                Show container navigation
              </label>
            </p>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
