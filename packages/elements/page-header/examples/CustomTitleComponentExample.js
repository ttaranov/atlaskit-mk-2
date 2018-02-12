// @flow
import React from 'react';

import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { ButtonGroup } from '@atlaskit/button';
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

const barContent = (
  <ButtonGroup>
    <TextField isLabelHidden placeholder="Filter" label="hidden" />
  </ButtonGroup>
);

const textStyle = {
  fontSize: '1.7142857142857142em',
  lineHeight: '1.1666666666666667em',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  height: 'auto',
};

const CustomTitleComponent = () => (
  <InlineEdit
    isLabelHidden
    readView={
      <SingleLineTextInput
        style={textStyle}
        isEditing={false}
        value={'Custom title component'}
      />
    }
    editView={
      <SingleLineTextInput
        style={textStyle}
        isEditing
        value={'Edit custom title'}
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
    useStyledWrapper={false}
  >
    <CustomTitleComponent />
  </PageHeader>
);
