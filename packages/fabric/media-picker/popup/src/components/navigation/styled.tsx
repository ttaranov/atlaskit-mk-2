/* tslint:disable:variable-name */
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  akColorN900,
  akColorN500,
  akColorN0,
} from '@atlaskit/util-shared-styles';

export const FolderViewerNavigation = styled.div`
  display: flex;
  justify-content: space-between;

  /* Ensure header has height */
  min-height: 60px;
  padding: 15px 13px;
  border-radius: 3px;

  background-color: ${akColorN0};
`;

export const ControlsWrapper = styled.div``;

export const Controls = styled.div`
  height: 30px;
  display: flex;
`;

export const ControlButton = styled(Button)`
  margin-right: 5px;
`;

export const BreadCrumbs = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface BreadCrumbLinkLabelProps {
  isLast: boolean;
}

export const BreadCrumbLinkLabel = styled.span`
  &:hover {
    text-decoration: ${(props: BreadCrumbLinkLabelProps) =>
      props.isLast ? 'none' : 'underline'};
  }
`;

export const BreadCrumbLinkSeparator = styled.span`
  color: ${akColorN500};
  display: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? 'none' : 'inline'};
  margin: 0px 4px;
  text-decoration: none;
`;

export const BreadCrumbLink = styled.span`
  color: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? akColorN900 : akColorN500};
  cursor: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? 'default' : 'pointer'};
  font-size: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? '20px' : '14px'};
`;

export const AccountItemButton = styled(Button)`` as any;

// Dropdown is NOT intentionally extended by this component to allow HACK style below to work
export const AccountDropdownWrapper = styled.div`
  /* TODO: remove this when the ak-dropdown-menu package supports custom item types */
  span[role='presentation'] > span > span:first-child {
    display: none;
  }
`;
