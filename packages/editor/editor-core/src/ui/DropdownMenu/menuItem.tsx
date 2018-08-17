import * as React from 'react';
import { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { HTMLAttributes, ComponentClass } from 'react';

import styled from 'styled-components';
import { akColorN200 } from '@atlaskit/util-shared-styles';
import { messages } from '@atlaskit/editor-common';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Shortcut: ComponentClass<HTMLAttributes<{}>> = styled.span`
  color: ${akColorN200};
  margin-left: 20px;
`;

export interface Props {
  value?: string;
  intlId?: string;
  shortcut?: string;
}

export default class MenuItem extends PureComponent<Props, any> {
  render() {
    const { value, intlId, shortcut } = this.props;
    return (
      <Wrapper>
        {value}
        {intlId && <FormattedMessage {...messages[intlId]} />}
        {shortcut && <Shortcut>{shortcut}</Shortcut>}
      </Wrapper>
    );
  }
}
