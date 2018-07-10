// @flow
/* eslint-disable react/no-multi-comp */
import React, { type Node } from 'react';
import Button from '@atlaskit/button';
import EmojiIcon from '@atlaskit/icon/glyph/emoji';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InlineDialog from '@atlaskit/inline-dialog';
import ModalDialog from '@atlaskit/modal-dialog';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
} from '@atlaskit/onboarding';
import Tooltip from '@atlaskit/tooltip';

const TooltipButton = ({
  children,
  onClick,
}: {
  children: Node,
  onClick: Function,
}) => (
  <Tooltip content="Click me">
    <Button onClick={onClick}>{children}</Button>
  </Tooltip>
);

type SpotlightProps = {
  stepOne: Node,
  stepTwo: Node,
  stepThree: Node,
  open: boolean,
  onFinish: () => void,
};

class ThreeStepSpotlight extends React.Component<
  SpotlightProps,
  { step: number },
> {
  state = {
    step: 1,
  };
  next = () => {
    const nextStep = this.state.step + 1;
    if (nextStep > 3) {
      this.setState({ step: 1 });
      this.props.onFinish();
    } else {
      this.setState({ step: nextStep });
    }
  };
  render() {
    const { stepOne, stepTwo, stepThree, open } = this.props;
    const { step } = this.state;
    return (
      <SpotlightManager>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '24px',
          }}
        >
          <SpotlightTarget name="1">{stepOne}</SpotlightTarget>
          <SpotlightTarget name="2">{stepTwo}</SpotlightTarget>
          <SpotlightTarget name="3">{stepThree}</SpotlightTarget>
        </div>
        {open && (
          <Spotlight
            actions={[
              { onClick: this.next, text: step === 3 ? 'Close' : 'Next' },
            ]}
            heading={`Here is step ${step} of 3`}
            key={`${step}`}
            target={`${step}`}
          />
        )}
      </SpotlightManager>
    );
  }
}

type State = {
  onboardingOpen: boolean,
  modalOpen: boolean,
  inlineOpen: boolean,
  flags: number[],
};

class App extends React.Component<{}, State> {
  state = {
    onboardingOpen: false,
    inlineOpen: false,
    modalOpen: false,
    flags: [],
  };
  closeModal = () => this.setState({ modalOpen: false });
  toggleOnboarding = (onboardingOpen: boolean) =>
    this.setState({ onboardingOpen });
  toggleInline = (inlineOpen: boolean) => this.setState({ inlineOpen });
  addFlag = () =>
    this.setState({ flags: [this.state.flags.length, ...this.state.flags] });
  removeFlag = (id: number) =>
    this.setState({ flags: this.state.flags.filter(v => v !== id) });
  render() {
    const { onboardingOpen, modalOpen, inlineOpen, flags } = this.state;
    return (
      <React.Fragment>
        {modalOpen && (
          <ModalDialog
            heading="Modal dialog 🔥"
            onClose={this.closeModal}
            actions={[
              { text: 'Open another', onClick: this.openModal },
              { text: 'Close', onClick: this.closeModal },
            ]}
          >
            <p>This dialog has three great features:</p>
            <ThreeStepSpotlight
              open={onboardingOpen}
              onFinish={() => this.toggleOnboarding(false)}
              stepOne={
                <TooltipButton onClick={() => this.toggleOnboarding(true)}>
                  Show onboarding
                </TooltipButton>
              }
              stepTwo={
                <InlineDialog
                  content="This button is very nice"
                  isOpen={inlineOpen}
                >
                  <TooltipButton onClick={() => this.toggleInline(!inlineOpen)}>
                    Show an inline dialog
                  </TooltipButton>
                </InlineDialog>
              }
              stepThree={
                <TooltipButton onClick={() => this.addFlag()}>
                  Show an flag
                </TooltipButton>
              }
            />
          </ModalDialog>
        )}
        <TooltipButton onClick={() => this.setState({ modalOpen: true })}>
          Open Dialog
        </TooltipButton>
        <FlagGroup onDismissed={name => this.removeFlag(name)}>
          {flags.map(id => (
            <Flag
              id={id}
              key={`${id}`}
              icon={<EmojiIcon />}
              title={`${id + 1}: Whoa a new flag!`}
            />
          ))}
        </FlagGroup>
      </React.Fragment>
    );
  }
}

export default App;
