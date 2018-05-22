// @flow
import React, { Component, type Node, type ElementType } from 'react';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InfoIcon from '@atlaskit/icon/glyph/info';

import {
  Container,
  Title,
  Description,
  Actions,
  Action,
  IconWrapper,
  Content,
  ContentContainer,
} from './styled';

const newAppearanceObj = {
  info: {
    backgroundColor: colors.B50,
    Icon: InfoIcon,
    primaryIconColor: colors.B500,
  },
  warning: {
    backgroundColor: colors.Y50,
    Icon: WarningIcon,
    primaryIconColor: colors.Y500,
  },
  error: {
    backgroundColor: colors.R50,
    Icon: ErrorIcon,
    primaryIconColor: colors.R500,
  },
  confirmation: {
    backgroundColor: colors.G50,
    Icon: CheckCircleIcon,
    primaryIconColor: colors.G500,
  },
  change: {
    backgroundColor: colors.P50,
    Icon: InfoIcon,
    primaryIconColor: colors.P500,
  },
};

export type Appearance =
  | 'info'
  | 'warning'
  | 'error'
  | 'confirmation'
  | 'change';

// There is a bug in eslint react with flow types being spread in function.
// See https://github.com/yannickcr/eslint-plugin-react/issues/1764 for context
// eslint-disable-next-line react/no-unused-prop-types
type ActionType = { text: string, onClick?: () => void, href?: string };

type Props = {
  /* The appearance styling to use for the section message. */
  appearance: Appearance,
  /*
    The main content of the section message. This accepts a react node, although
    we recommend that this should be a paragraph.
  */
  children: Node,
  /*
    The title to be displayed with the message. If provided, it will be rendered
    with a h5-level heading.
  */
  title?: string,
  /*
    Actions to be taken from the section message. We recommend that links are
    used for these (as seen in the examples). According to the design spec, there
    should be no more than two actions in a section message.
  */
  actions?: Array<ActionType>,
  /*
    An Icon component to be rendered instead of the default icon for the component.
    This should only be an `@atlaskit/icon` icon. You can check out [this example](http://localhost:9000/packages/core/section-message/example/custom-icon)
    to see how to provide this icon.
  */
  icon?: ElementType,
  /*
    A custom link component. This prop is designed to allow a custom link
    component to be passed to the link button being rendered by actions. The
    intended use-case is for when a custom router component such as react router
    is being used within the application.

    This component will only be used if a href is passed to the action.

    All actions provided will automatically have the linkcomponent passed to them.
  */
  linkComponent?: ElementType,
};

export default class SectionMessage extends Component<Props, *> {
  static defaultProps = {
    appearance: 'info',
  };

  renderAction = ({
    text,
    onClick,
    href,
    linkComponent,
  }: ActionType & { linkComponent?: ElementType }) => {
    if (onClick || href) {
      return (
        <Action key={text}>
          <Button
            appearance="link"
            spacing="none"
            onClick={onClick}
            href={href}
            component={linkComponent}
          >
            {text}
          </Button>
        </Action>
      );
    }
    return <Action key={text}>{text}</Action>;
  };

  render() {
    const {
      children,
      title,
      actions,
      appearance,
      icon,
      linkComponent,
    } = this.props;
    const appearanceObj = newAppearanceObj[appearance] || newAppearanceObj.info;
    const Icon = icon || appearanceObj.Icon;

    return (
      <Container backgroundColor={appearanceObj.backgroundColor}>
        <ContentContainer>
          <IconWrapper>
            <Icon primaryColor={appearanceObj.primaryIconColor} />
          </IconWrapper>
          <Content>
            {title ? <Title>{title}</Title> : null}
            {children ? <Description>{children}</Description> : null}
            {actions && actions.length > 0 ? (
              <Actions>
                {actions.map(action =>
                  this.renderAction({ ...action, linkComponent }),
                )}
              </Actions>
            ) : null}
          </Content>
        </ContentContainer>
      </Container>
    );
  }
}
