import * as React from 'react';
import styled from 'styled-components';
import Navigation, {
  AkGlobalItem,
  AkCreateDrawer,
  AkSearchDrawer,
  presetThemes,
} from '@atlaskit/navigation';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import AtlassianIcon from '@atlaskit/logo';
import SearchIcon from '@atlaskit/icon/glyph/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import Avatar from '@atlaskit/avatar';

export interface Props {
  searchDrawerContent: JSX.Element;
}

export interface State {
  openDrawer: string;
}

export default class BasicNavigation extends React.Component<Props, State> {
  constructor(...args) {
    super(...args);
    this.state = {
      openDrawer: 'search',
    };
  }

  openDrawer = () => {
    this.setState({
      openDrawer: 'search',
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  render() {
    return (
      <Navigation
        globalTheme={presetThemes.global}
        containerTheme={presetThemes.container}
        isResizeable={true}
        globalPrimaryIcon={<AtlassianIcon label="atl" size="large" />}
        globalPrimaryItemHref="#"
        width={300}
        isOpen={true}
        openDrawer={this.state.openDrawer}
        drawers={[
          <AkSearchDrawer
            isOpen={this.state.openDrawer === 'search'}
            key="search"
            onBackButton={this.closeDrawer}
            primaryIcon={<AtlassianIcon label="atl" size="large" />}
            backIcon={<ArrowleftIcon label="back" size="medium" />}
          >
            {this.props.searchDrawerContent}
          </AkSearchDrawer>,
        ]}
        globalSearchIcon={
          <SearchIcon
            label="Search icon"
            secondaryColor="inherit"
            size="medium"
          />
        }
        onSearchDrawerOpen={this.openDrawer}
        globalSecondaryActions={[
          <AkGlobalItem key="help">
            <QuestionCircleIcon
              label="Help icon"
              secondaryColor="inherit"
              size="medium"
            />
          </AkGlobalItem>,
          <AkGlobalItem key="profile">
            <Avatar
              size="small"
              src="http://api.adorable.io/avatar/32/luke"
              borderColor="transparent"
            />
          </AkGlobalItem>,
        ]}
      >
        <div>Boards</div>
        <div>Projects</div>
        <div>Settings</div>
      </Navigation>
    );
  }
}
