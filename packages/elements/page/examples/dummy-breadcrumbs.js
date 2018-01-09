import React, { PureComponent } from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';

export default class DummyCode extends PureComponent {
  render() {
    return (
      <Breadcrumbs>
        <BreadcrumbsItem href="#" text="Atlassian" />
        <BreadcrumbsItem href="#" text="Atlaskit" />
        <BreadcrumbsItem href="#" text="AK-1252-grid-component" />
        <BreadcrumbsItem href="#" text="Commits" />
      </Breadcrumbs>
    );
  }
}
