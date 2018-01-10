// @flow
import React, { PureComponent } from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import SearchIcon from '@atlaskit/icon/glyph/search';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import AkDropdownMenu from '@atlaskit/dropdown-menu';
import Avatar from '@atlaskit/avatar';
import InlineDialog from '@atlaskit/inline-dialog';
import Tooltip from '@atlaskit/tooltip';
import Navigation, {
  presetThemes,
  AkContainerTitle,
  AkNavigationItemGroup,
  AkNavigationItem,
  AkSearchDrawer,
  AkCreateDrawer,
  AkGlobalItem,
  AkContainerNavigationNested,
} from '../src';
import BasicSearch from '../stories/components/BasicSearch';
// import nucleusLogo from '../stories/nucleus.png';
// import emmaAvatar from '../stories/emma.png';
import Menu from '../stories/examples/menu';

export default class GlobalNavExample extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      stack: [Menu],
      isHeaderInlineDialogOpen: false,
      openDrawer: this.props.openDrawer,
      width: this.props.width,
    };
  }

  openDrawer = name => {
    this.setState({
      openDrawer: name,
    });
  };

  closeDrawer = () => {
    this.setState({
      openDrawer: null,
    });
  };

  resize = resizeState => {
    action('onResize')();
    this.setState({
      isOpen: resizeState.isOpen,
      width: resizeState.width,
    });
  };

  stackPush = newPage => {
    const stack = [...this.state.stack, newPage];
    this.setState({ stack });
  };

  stackPop = () => {
    if (this.state.stack.length <= 1) {
      return false;
    }

    const stack = this.state.stack.slice(0, this.state.stack.length - 1);
    return this.setState({ stack });
  };

  renderItem = item => {
    const onClick = item.childMenu
      ? () => this.stackPush(item.childMenu)
      : () => console.log(`Link item clicked: '${item.component.props.text}'`);
    const key = item.component.props.text;

    return !this.props.withtootips ? (
      React.cloneElement(item.component, { key, onClick })
    ) : (
      <Tooltip content={key} position="right">
        {React.cloneElement(item.component, { key, onClick })}
      </Tooltip>
    );
  };

  renderStack = () =>
    this.state.stack.map(page => page.map(item => this.renderItem(item)));

  render() {
    const backIcon = (
      <Tooltip position="right" content="Back">
        <ArrowLeftIcon label="Back icon" size="medium" />
      </Tooltip>
    );
    const globalPrimaryIcon = (
      <AtlassianIcon label="Atlassian icon" size="large" />
    );
    const globalCreateIcon = (
      <Tooltip position="right" content="Create">
        <AddIcon label="Create icon" secondaryColor="inherit" size="medium" />
      </Tooltip>
    );
    const globalSearchIcon = (
      <Tooltip position="right" content="Search">
        <SearchIcon
          label="Search icon"
          secondaryColor="inherit"
          size="medium"
        />
      </Tooltip>
    );

    const headerComponent = (
      <AkContainerTitle
        href="#foo"
        icon={<img alt="nucleus" src={nucleusLogo} />}
        text="Atlaskit"
        subText="Is the king"
      />
    );

    // eslint-disable-no-static-element-interactions
    const HeaderComponent = () => {
      const backButton =
        this.state.stack.length > 1 ? (
          <AkNavigationItem
            icon={<ArrowLeftIcon label="Back" />}
            onClick={() => this.stackPop()}
            text="Back"
            key="2"
          />
        ) : null;

      /* eslint-disable jsx-a11y/no-static-element-interactions */
      return [
        <InlineDialog
          content={
            <div style={{ maxWidth: '200px' }}>
              Menu or something like the HipChat status form would go here
            </div>
          }
          isOpen={this.state.isHeaderInlineDialogOpen}
          position="bottom left"
        >
          <div
            onClick={() => {
              this.setState({
                isHeaderInlineDialogOpen: !this.state.isHeaderInlineDialogOpen,
              });
            }}
          >
            <Tooltip key="1" position="right" content="Header tooltip text">
              {headerComponent}
            </Tooltip>
          </div>
        </InlineDialog>,
        backButton,
      ];
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    };

    const helpMenu = (
      <AkDropdownMenu
        appearance="tall"
        items={[
          {
            heading: 'Help',
            items: [
              { content: 'Documentation' },
              { content: 'Learn Git' },
              { content: 'Keyboard shortcuts' },
              { content: 'Bitbucket tutorials' },
              { content: 'API' },
              { content: 'Support' },
            ],
          },
          {
            heading: 'Information',
            items: [
              { content: 'Latest features' },
              { content: 'Blog' },
              { content: 'Plans & pricing' },
              { content: 'Site status' },
              { content: 'Version info' },
            ],
          },
          {
            heading: 'Legal',
            items: [
              { content: 'Terms of service' },
              { content: 'Privacy policy' },
            ],
          },
        ]}
        position="right bottom"
      >
        <AkGlobalItem href="">
          <QuestionCircleIcon
            label="Help icon"
            secondaryColor="inherit"
            size="medium"
          />
        </AkGlobalItem>
      </AkDropdownMenu>
    );

    const userMenu = (
      <AkDropdownMenu
        appearance="tall"
        items={[
          {
            heading: 'Luke Skywalker',
            items: [
              { content: 'View profile' },
              { content: 'Manage Atlassian account' },
              { content: 'Bitbucket settings' },
              { content: 'Integrations' },
              { content: 'Bitbucket labs' },
              { content: 'Log out' },
            ],
          },
        ]}
      >
        <AkGlobalItem href="">
          <Avatar size="medium" src={emmaAvatar} />
        </AkGlobalItem>
      </AkDropdownMenu>
    );

    const searchDrawer = (
      <AkSearchDrawer
        backIcon={backIcon}
        isOpen={this.state.openDrawer === 'search'}
        key="search"
        onBackButton={this.closeDrawer}
        primaryIcon={globalPrimaryIcon}
      >
        <BasicSearch />
      </AkSearchDrawer>
    );

    const createDrawer = (
      <AkCreateDrawer
        backIcon={backIcon}
        header={headerComponent}
        isOpen={this.state.openDrawer === 'create'}
        key="create"
        onBackButton={this.closeDrawer}
        primaryIcon={globalPrimaryIcon}
      >
        <AkNavigationItem text="Item outside a group" />
        <AkNavigationItemGroup title="Create item group">
          <AkNavigationItem
            icon={<img alt="icon" src={nucleusLogo} />}
            text="Item with an icon"
          />
          <AkNavigationItem
            icon={<img alt="icon" src={nucleusLogo} />}
            text="A really, really, quite long, actually super long container name"
          />
        </AkNavigationItemGroup>
      </AkCreateDrawer>
    );

    return (
      <Navigation
        containerTheme={presetThemes.global}
        globalTheme={presetThemes.global}
        containerHeaderComponent={HeaderComponent}
        globalCreateIcon={globalCreateIcon}
        globalPrimaryIcon={globalPrimaryIcon}
        globalPrimaryItemHref="//www.atlassian.com"
        globalSearchIcon={globalSearchIcon}
        isOpen={this.state.isOpen}
        globalSecondaryActions={[helpMenu, userMenu]}
        onCreateDrawerOpen={() => {
          this.openDrawer('create');
        }}
        onResize={this.resize}
        onResizeStart={action('resizeStart')}
        onSearchDrawerOpen={() => {
          this.openDrawer('search');
        }}
        openDrawer={this.state.openDrawer}
        resizeHandler={action('resize')}
        width={this.state.width}
        drawers={[searchDrawer, createDrawer]}
      >
        <AkContainerNavigationNested stack={this.renderStack()} />
      </Navigation>
    );
  }
}
