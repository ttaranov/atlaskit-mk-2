// @flow
import React, { Component } from 'react';
// import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
// import SearchIcon from '@atlaskit/icon/glyph/search';
// import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
//
// import Navigation, {
//   AkNavigationItemGroup,
//   AkSearchDrawer,
//   AkNavigationItem,
//   AkContainerTitle,
//   AkSearch,
// } from '../src';

// const items = ['cat', 'dog', 'fish', 'lizard'];

type State = {
  searchDrawerOpen: boolean,
  value: string,
};

class ExampleNav extends Component<void, State> {
  state = {
    searchDrawerOpen: false,
    value: '',
  };

  render() {
    return (
      <span> Example temporarily removed pending website optimisations </span>
    );
    //   return (
    //     <Navigation
    //       globalPrimaryIcon={<AtlassianIcon size="xlarge" label="Atlassian" />}
    //       globalPrimaryItemHref="/components/navigation"
    //       globalSearchIcon={<SearchIcon label="search" />}
    //       onSearchDrawerOpen={() =>
    //         this.setState({ searchDrawerOpen: !this.state.searchDrawerOpen })
    //       }
    //       drawers={[
    //         <AkSearchDrawer
    //           backIcon={<ArrowLeft label="Back" />}
    //           primaryIcon={<SearchIcon label="Search" />}
    //           header="Some Header"
    //           isOpen={this.state.searchDrawerOpen}
    //           onBackButton={() => this.setState({ searchDrawerOpen: false })}
    //         >
    //           <AkSearch
    //             onSearchClear={() => this.setState({ value: '' })}
    //             // $FlowFixMe
    //             onInput={e => this.setState({ value: e.target.value })}
    //             value={this.state.value}
    //           >
    //             {items
    //               .filter(item => item.includes(this.state.value))
    //               .map(item => <AkNavigationItem text={item} />)}
    //           </AkSearch>
    //         </AkSearchDrawer>,
    //       ]}
    //       containerHeaderComponent={() => (
    //         <AkContainerTitle
    //           icon={<AtlassianIcon label="Atlassian" />}
    //           text="NavTitle"
    //         />
    //       )}
    //     >
    //       <AkNavigationItemGroup>
    //         <AkNavigationItem text="Nav Item" href="/components/navigation" />
    //         <AkNavigationItem
    //           text="Selected Item"
    //           isSelected
    //           href="/components/navigation"
    //         />
    //       </AkNavigationItemGroup>
    //     </Navigation>
    //   );
  }
}

export default ExampleNav;
