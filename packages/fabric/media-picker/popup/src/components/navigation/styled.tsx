/* tslint:disable:variable-name */
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  akColorN900,
  akColorN500,
  akColorN0,
} from '@atlaskit/util-shared-styles';

export const FolderViewerNavigation = styled.div`
  box-sizing: border-box;
  font-size: 13px;
  padding: 15px 13px 15px 260px;
  background-color: ${akColorN0};
  max-height: 60px;
  position: fixed;
  width: calc(100% - 15px);
  left: 0;
  top: 0;
  z-index: 30;
  border-radius: 3px;
`;

export const ControlsWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const Controls = styled.div`
  height: 30px;
  display: flex;
`;

export const ControlSeparator = styled.div`
  display: block;
  height: 20px;
  min-width: 4px;
`;

export const ControlButton = styled(Button)`` as any;

export const BreadCrumbs = styled.div`
  width: 'calc(100% - 100px)';
  box-sizing: border-box;
  vertical-align: middle;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
  top: ${(props: BreadCrumbLinkLabelProps) => (props.isLast ? '0' : 'auto')};
  position: relative;
`;

export const AccountItemButton = styled(Button)`` as any;

// Dropdown is NOT intentionally extended by this component to allow HACK style below to work
export const AccountDropdownWrapper = styled.div`
  /* TODO: remove this when the ak-dropdown-menu package supports custom item types */
  span[role='presentation'] > span > span:first-child {
    display: none;
  }
  // background: red;
  // TODO [MSW-314]: Remove DropdownMenu override
  .crdjFp > div > div:last-child {
    position: absolute !important;
    transform: translate3d(-130px, 38px, 0px) !important;
  }
`;
