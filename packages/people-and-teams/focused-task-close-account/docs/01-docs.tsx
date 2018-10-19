import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage appearance="warning">
      <p>
        <strong>
          Note: @atlaskit/focused-task-close-account is currently a developer
          preview.
        </strong>
      </p>
      <p>
        Please experiment with and test this package, but be aware that the API
        may change at any time. Use at your own risk, preferrably not in
        production.
      </p>
    </SectionMessage>
  )}

  ### Usage

  This package provides the view components required to assemble the "Right to be forgotten" drawers.

  By providing the building blocks rather than a single complete solution, a simpler and more flexible API can be provided for adjustments, customizations and data-routing.

  Start by rendering a FocusedTaskCloseAccount then provide it the necessary screens, plugging in data providing callbacks where necessary.

  For example, to assemble the "Delete user" flow, provide the DeleteUserOverviewScreen and DeleteUserContentPreviewScreen.

  ### Install

  ${code`
import {
  FocusedTaskCloseAccount,
  DeleteUserOverviewScreen,
  DeleteUserContentPreviewScreen,
} from '@atlaskit/focused-task-close-account';
  `}

### Examples
  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Basic drawer assembly"
      Component={require('../examples/00-BasicDrawerAssembly').default}
      source={require('!!raw-loader!../examples/00-BasicDrawerAssembly')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Delete user drawer"
      Component={require('../examples/01-DeleteUserDrawer').default}
      source={require('!!raw-loader!../examples/01-DeleteUserDrawer')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Single screen drawer"
      Component={require('../examples/02-SingleScreenDrawer').default}
      source={require('!!raw-loader!../examples/02-SingleScreenDrawer')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/FocusedTaskCloseAccount')}
    />
  )}

`;
