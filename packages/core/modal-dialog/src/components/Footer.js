// @flow
import React, { createElement, Component } from 'react';
import Button from '@atlaskit/button';

import type { AppearanceType, ComponentType, FunctionType } from '../types';
import { Actions, ActionItem, Footer } from '../styled/Content';

const JustifyShim = props => <span {...props} />;

type Props = {
  /** Buttons to render in the footer */
  actions?: Array<{
    onClick?: FunctionType,
    text?: string,
  }>,
  /** Appearance of the primary button. Also adds an icon to the heading, if provided. */
  appearance?: AppearanceType,
  /** Component to render the footer of the moda.l */
  component?: ComponentType,
  /** Function to close the dialog */
  onClose: FunctionType,
  /** Whether or not to display a line above the footer */
  showKeyline?: boolean,
};

export default class ModalFooter extends Component<Props, {}> {
  props: Props; // eslint-disable-line react/sort-comp

  render() {
    const { actions, appearance, component, onClose, showKeyline } = this.props;
    const warning = 'You can provide `component` OR `actions`, not both.';

    if (!component && !actions) return null;
    if (component && actions) return console.warn(warning); // eslint-disable-line no-console
    if (component) {
      return createElement(component, {
        appearance,
        onClose,
        showKeyline,
      });
    }

    return (
      <Footer showKeyline={showKeyline}>
        <JustifyShim />
        <Actions>
          {actions
            ? actions.map(({ text, ...rest }, idx) => {
                const variant = idx ? 'subtle' : appearance || 'primary';
                return (
                  <ActionItem key={text || idx}>
                    <Button appearance={variant} {...rest}>
                      {text}
                    </Button>
                  </ActionItem>
                );
              })
            : null}
        </Actions>
      </Footer>
    );
  }
}
