// @flow
import React from 'react';

import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/field-text';
import InlineEdit from '@atlaskit/inline-edit';
import SingleLineTextInput from '@atlaskit/input';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
);
const barContent = (
  <ButtonGroup>
    <TextField isLabelHidden placeholder="Filter" label="hidden" />
  </ButtonGroup>
);

const textStyle = {
  fontSize: '24px',
  fontWeight: '500',
};

const CustomTitleComponent = () => (
  <InlineEdit
    isLabelHidden
    readView={
      <SingleLineTextInput
        style={textStyle}
        isEditing={false}
        value={'Editable title'}
      />
    }
    editView={
      <SingleLineTextInput
        style={textStyle}
        isInitiallySelected
        isEditing
        value={'Editable title'}
        onChange={() => {}}
      />
    }
    onConfirm={() => {}}
    onCancel={() => {}}
  />
);

export default () => (
  <PageHeader
    breadcrumbs={breadcrumbs}
    bottomBar={barContent}
    actions={actionsContent}
    disableTitleStyles
  >
    <CustomTitleComponent />
  </PageHeader>
);
