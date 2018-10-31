// @flow

import React, { Component, type ElementType, type Node } from 'react';
import { ThemeProvider } from 'styled-components';
import Modal from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';

import { Actions, ActionItem, Body, Heading, Image } from '../styled/Modal';
import { getModalTheme } from './theme';
import type { ActionsType } from '../types';

/* eslint-disable react/no-unused-prop-types */
type Props = {|
  /** Buttons to render in the footer */
  actions?: ActionsType,
  /** The elements rendered in the modal */
  children: Node,
  /** Path to the the your image */
  image?: string,
  /** Optional element rendered above the body */
  header?: ElementType,
  /** Optional element rendered below the body */
  footer?: ElementType,
  /** Heading text rendered above the body */
  heading?: string,
|};
/* eslint-enable react/no-unused-prop-types */

// NOTE: @atlaskit/modal-dialog expects a component for header/footer. This is
// inconsistent with Spotlight so we take the element and create a
// stateless-functional component.
function makeFnComp(element) {
  return element ? () => element : null;
}
function noop() {}

export default class OnboardingModal extends Component<Props> {
  headerComponent = (props: Props) => {
    const { header: headerElement, image: src } = props;

    const imageElement = <Image alt="" src={src} />;
    const header = makeFnComp(headerElement);
    const image = makeFnComp(imageElement);

    return header || image;
  };
  footerComponent = (props: Props) => {
    const { footer: footerElement, actions: actionList } = props;

    const actionsElement = actionList ? (
      <ThemeProvider theme={getModalTheme}>
        <Actions>
          {actionList.map(({ text, key, ...rest }, idx) => {
            const variant = idx ? 'subtle-link' : 'primary';
            return (
              <ActionItem
                key={key || (typeof text === 'string' ? text : `${idx}`)}
              >
                <Button appearance={variant} autoFocus={!idx} {...rest}>
                  {text}
                </Button>
              </ActionItem>
            );
          })}
        </Actions>
      </ThemeProvider>
    ) : null;
    const footer = makeFnComp(footerElement);
    const actions = makeFnComp(actionsElement);

    return footer || actions;
  };

  render() {
    const { actions, children, heading, ...props } = this.props;

    return (
      <Modal
        autoFocus
        footer={this.footerComponent(this.props)}
        header={this.headerComponent(this.props)}
        onClose={noop}
        scrollBehavior="outside"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        {...props}
      >
        <Body>
          {heading && <Heading>{heading}</Heading>}
          {children}
        </Body>
      </Modal>
    );
  }
}
