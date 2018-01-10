// @flow
import React, { PureComponent, type Node, type ComponentType } from 'react';
import GlobalItem from './GlobalItem';
import DrawerTrigger from './DrawerTrigger';
import DefaultLinkComponent from './DefaultLinkComponent';
import GlobalPrimaryActionsList from './GlobalPrimaryActionsList';
import GlobalPrimaryActionsInner from '../styled/GlobalPrimaryActionsInner';
import GlobalPrimaryActionsPrimaryItem from '../styled/GlobalPrimaryActionsPrimaryItem';
import GlobalPrimaryActionsItemsWrapper from '../styled/GlobalPrimaryActionsItemsWrapper';
import type { IconAppearance } from '../../types';

type Props = {
  actions: Array<Node>,
  createIcon: Node,
  linkComponent: ComponentType<*>,
  onCreateActivate: (event: Event) => void,
  onSearchActivate: (event: Event) => void,
  primaryIcon: () => {},
  primaryIconAppearance: IconAppearance,
  primaryItemHref: string,
  searchIcon: Node,
};

export default class GlobalPrimaryActions extends PureComponent<Props> {
  static defaultProps = {
    linkComponent: DefaultLinkComponent,
  };

  render() {
    const {
      actions,
      createIcon,
      linkComponent,
      onCreateActivate,
      onSearchActivate,
      primaryIcon,
      primaryIconAppearance,
      primaryItemHref,
      searchIcon,
    } = this.props;
    return (
      <GlobalPrimaryActionsInner>
        {primaryIcon ? (
          <GlobalPrimaryActionsPrimaryItem>
            <GlobalItem
              href={primaryItemHref}
              linkComponent={linkComponent}
              size="medium"
              appearance={primaryIconAppearance}
            >
              {primaryIcon}
            </GlobalItem>
          </GlobalPrimaryActionsPrimaryItem>
        ) : null}

        <GlobalPrimaryActionsItemsWrapper>
          {actions ? (
            <GlobalPrimaryActionsList actions={actions} />
          ) : (
            <div>
              {searchIcon ? (
                <DrawerTrigger onActivate={onSearchActivate}>
                  {searchIcon}
                </DrawerTrigger>
              ) : null}
              {createIcon ? (
                <DrawerTrigger onActivate={onCreateActivate}>
                  {createIcon}
                </DrawerTrigger>
              ) : null}
            </div>
          )}
        </GlobalPrimaryActionsItemsWrapper>
      </GlobalPrimaryActionsInner>
    );
  }
}
