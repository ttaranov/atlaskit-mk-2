// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import styled from 'styled-components';
import AddIcon from '@atlaskit/icon/glyph/add';
import StarIcon from '@atlaskit/icon/glyph/star';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import Button from '@atlaskit/button';
import ConfluenceIcon from '@atlaskit/icon/glyph/confluence';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import Lorem from 'react-lorem-component';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Tooltip from '@atlaskit/tooltip';
import { gridSize } from '@atlaskit/theme';
import Navigation, {
  AkContainerNavigationNested,
  AkGlobalItem,
  AkCreateDrawer,
  AkCustomDrawer,
  AkNavigationItem,
  AkSearchDrawer,
  presetThemes,
  SkeletonDefaultContainerHeader,
  SkeletonContainerItems,
} from '@atlaskit/navigation';
//import { Router, Link } from '@reach/router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import paths from '../CONTENTFUL_DATA';

const SkeletonItemsWrapper = styled.div`
  padding-right: ${gridSize() * 3}px;
`;

const BackIcon = (
  <Tooltip position="right" content="Back">
    <ArrowLeftIcon label="Back icon" size="medium" />
  </Tooltip>
);

const ContainerHeaderComponent = ({
  stackLength,
  goBackHome,
}: {
  stackLength: number,
  goBackHome: () => mixed,
}) => (
  <div>
    <SkeletonDefaultContainerHeader />
    {stackLength > 1 ? (
      <AkNavigationItem
        icon={<ArrowLeftIcon label="Add-ons icon" />}
        onClick={() => goBackHome()}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            goBackHome();
          }
        }}
        text="Add-ons"
      />
    ) : null}
  </div>
);

const GlobalSearchIcon = ({ openDrawer }: { openDrawer: string => void }) => (
  <Tooltip content="Search Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('search')}>
      <SearchIcon />
    </AkGlobalItem>
  </Tooltip>
);

const GlobalCreateIcon = ({ openDrawer }: { openDrawer: string => void }) => (
  <Tooltip content="Create Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('create')}>
      <AddIcon />
    </AkGlobalItem>
  </Tooltip>
);

const StarDrawerIcon = ({ openDrawer }: { openDrawer: string => void }) => (
  <Tooltip content="Custom Drawer Icon" position="right">
    <AkGlobalItem size="medium" onClick={() => openDrawer('custom')}>
      <StarIcon />
    </AkGlobalItem>
  </Tooltip>
);

export default class ConfluenceHome extends Component<*, *> {
  state = {
    isOpen: true,
    menuLoading: true,
    openDrawer: null,
    stack: [<SkeletonContainerItems />],
    width: this.props.width,
  };

  getStarCustomDrawer = () => (
    <AkCustomDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'custom'}
      key="custom"
      primaryIcon={<AtlassianIcon label="Confluence icon" size="large" />}
      header={<SkeletonDefaultContainerHeader isAvatarHidden />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
    </AkCustomDrawer>
  );

  getSearchDrawer = () => (
    <AkSearchDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'search'}
      key="search"
      primaryIcon={<AtlassianIcon label="Confluence icon" size="large" />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
    </AkSearchDrawer>
  );

  getCreateDrawer = () => (
    <AkCreateDrawer
      backIcon={BackIcon}
      isOpen={this.state.openDrawer === 'create'}
      key="create"
      primaryIcon={<AtlassianIcon label="Confluence icon" size="large" />}
      onBackButton={this.closeDrawer}
    >
      <SkeletonItemsWrapper>
        <SkeletonContainerItems itemTextWidth="100%" />
      </SkeletonItemsWrapper>
    </AkCreateDrawer>
  );

  openDrawer = (name: string) => {
    console.log(`on ${name} drawer open called`);

    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = (resizeState: { isOpen: boolean, width: number }) => {
    console.log('onResize called');
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  goBackHome = () => {
    if (this.state.stack.length <= 1) {
      return false;
    }

    const stack = this.state.stack.slice(0, this.state.stack.length - 1);
    return this.setState({ stack });
  };

  timerMenu = () => {
    setTimeout(() => this.setState({ menuLoading: false }), 2000);
  };

  render() {
    return (
      <Page
        navigation={
          <Navigation
            drawers={[
              this.getSearchDrawer(),
              this.getCreateDrawer(),
              this.getStarCustomDrawer(),
            ]}
            containerHeaderComponent={() => (
              <ContainerHeaderComponent
                stackLength={this.state.stack.length}
                goBackHome={this.goBackHome}
              />
            )}
            globalPrimaryIcon={
              <AtlassianIcon label="Confluence icon" size="large" />
            }
            globalPrimaryItemHref="#"
            globalPrimaryActions={[
              <StarDrawerIcon openDrawer={this.openDrawer} />,
              <GlobalSearchIcon openDrawer={this.openDrawer} />,
              <GlobalCreateIcon openDrawer={this.openDrawer} />,
            ]}
            isOpen={this.state.isOpen}
            onResize={this.resize}
            onResizeStart={e => console.log('resizeStart', e)}
            width={this.state.width}
            hasScrollHintTop
          >
            {Object.keys(paths).map(path => (
              <AkNavigationItem
                href={'/' + path}
                key={path}
                text={paths[path].title}
              />
            ))}
          </Navigation>
        }
      >
        <Grid layout="fixed">
          <GridColumn medium={12}>
            <Router>
              <Switch>
                {Object.keys(paths).map(path => (
                  <Route
                    render={() => <App id={paths[path].id} />}
                    path={'/' + path}
                    key={paths[path].id}
                  />
                ))}
              </Switch>
            </Router>
            {/* <App /> */}
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}
