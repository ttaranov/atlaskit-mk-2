import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';
import * as React from 'react';

export const MultiValue = props => {
  const {
    components: { Container },
    data,
    data: {
      label,
      user: { avatarUrl },
    },
    innerProps,
    selectProps,
    removeProps: { onClick: onRemove },
    isFocused,
  } = props;

  // TODO i18n
  return (
    <Container data={data} innerProps={innerProps} selectProps={selectProps}>
      <Tag
        {...innerProps}
        appearance="rounded"
        text={label}
        elemBefore={<Avatar size="xsmall" src={avatarUrl} label={label} />}
        removeButtonText="remove"
        onAfterRemoveAction={onRemove}
        color={isFocused ? 'greyLight' : undefined}
      />
    </Container>
  );
};
