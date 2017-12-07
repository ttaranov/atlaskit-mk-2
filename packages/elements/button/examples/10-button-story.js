import { storiesOf, action } from '@kadira/storybook';

import React from 'react';
import styled from 'styled-components';
import Calendar from '@atlaskit/icon/glyph/calendar';
import Page from '@atlaskit/icon/glyph/page';
import Question from '@atlaskit/icon/glyph/question';
import Expand from '@atlaskit/icon/glyph/arrow-down';
import Unlink from '@atlaskit/icon/glyph/editor/unlink';
import Open from '@atlaskit/icon/glyph/editor/open';
import { colors } from '@atlaskit/theme';

import { name } from '../package.json';
import Button, { ButtonGroup } from '../src';
import DisabledButtonEvents from './examples/DisabledButtonEvents';

const css = `
  .container {
    display: flex;
    flex-direction: column;
    width: 70%;
  }
  .sample {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .purple-border {
    border: 1px solid purple;
  }
  .pink-bg {
    background-color: pink !important;
  }
  .truncated {
    max-width: 100px;
  }
`;

const NarrowWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  width: 190px;
  border: 1px solid red;

  & > * {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

class CustomComponent extends React.PureComponent {
  render() {
    const { children, innerRef, ...props } = this.props; // eslint-disable-line no-unused-vars
    return <div {...props}>{children}</div>;
  }
}

/* eslint-disable react/prop-types,max-len */
const buildBackgroundStory = () => {
  const createSample = ({
    backgroundColor,
    extraProps = { onClick: action('clicking the Component') },
  }) => (
    <div style={{ marginBottom: '30px' }}>
      <style>{'.buttonContainer > * { margin: 5px }'}</style>
      <div className="sample" style={{ backgroundColor }}>
        <div className="buttonContainer">
          <Button {...extraProps}>Default</Button>
          <Button {...extraProps} appearance="primary">
            Primary
          </Button>
          <Button {...extraProps} appearance="link">
            Link
          </Button>
          <Button {...extraProps} appearance="subtle">
            Subtle
          </Button>
          <Button {...extraProps} appearance="subtle-link">
            Subtle link
          </Button>
          <Button {...extraProps} isSelected>
            Selected
          </Button>
          <Button {...extraProps} component={CustomComponent}>
            Custom Component
          </Button>
          <Button {...extraProps} appearance="help">
            Help
          </Button>
        </div>
        <span> Normal States </span>
      </div>
      <div className="sample" style={{ backgroundColor }}>
        <div className="buttonContainer">
          <Button
            {...extraProps}
            iconAfter={<Question label="question icon" />}
          >
            Default
          </Button>
          <Button
            {...extraProps}
            appearance="primary"
            iconAfter={<Calendar label="calendar icon" />}
          >
            Primary
          </Button>
          <Button
            {...extraProps}
            appearance="link"
            iconAfter={<Page label="page icon" />}
          >
            Link
          </Button>
          <Button
            {...extraProps}
            appearance="subtle"
            iconAfter={<Expand label="expand icon" />}
          >
            Subtle
          </Button>
          <Button
            {...extraProps}
            appearance="subtle-link"
            iconAfter={<Unlink label="unlink icon" />}
          >
            Subtle link
          </Button>
          <Button
            {...extraProps}
            isSelected
            iconAfter={<Open label="open icon" />}
          >
            Selected
          </Button>
          <Button
            {...extraProps}
            appearance="help"
            iconAfter={<Unlink label="unlink icon" />}
          >
            Help
          </Button>
        </div>
        <span> Normal States + icons</span>
      </div>
      <div className="sample" style={{ backgroundColor }}>
        <div className="buttonContainer">
          <Button {...extraProps} isDisabled>
            Default Disabled
          </Button>
          <Button {...extraProps} appearance="primary" isDisabled>
            Primary Disabled
          </Button>
          <Button {...extraProps} appearance="link" isDisabled>
            Link Disabled
          </Button>
          <Button {...extraProps} appearance="subtle-link" isDisabled>
            Subtle link Disabled
          </Button>
          <Button {...extraProps} appearance="help" isDisabled>
            Help link Disabled
          </Button>
        </div>
        <span> Disabled variations </span>
      </div>
      <div className="sample" style={{ backgroundColor }}>
        <div className="buttonContainer">
          <Button
            {...extraProps}
            isDisabled
            iconAfter={<Page label="page icon" />}
          >
            Default Disabled
          </Button>
          <Button
            {...extraProps}
            appearance="primary"
            isDisabled
            iconAfter={<Question label="question icon" />}
          >
            Primary Disabled
          </Button>
          <Button
            {...extraProps}
            appearance="link"
            isDisabled
            iconAfter={<Calendar label="calendar icon" />}
          >
            Link Disabled
          </Button>
          <Button
            {...extraProps}
            appearance="subtle-link"
            isDisabled
            iconAfter={<Calendar label="calendar icon" />}
          >
            Subtle link Disabled
          </Button>
          <Button
            {...extraProps}
            appearance="help"
            isDisabled
            iconAfter={<Question label="question icon" />}
          >
            Help link Disabled
          </Button>
        </div>
        <span> Disabled variations + icons</span>
      </div>
      <div className="sample" style={{ backgroundColor }}>
        <div className="buttonContainer">
          <Button
            {...extraProps}
            spacing="none"
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            isSelected
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            appearance="primary"
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            isDisabled
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            appearance="subtle"
            spacing="none"
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            appearance="subtle-link"
            spacing="none"
            iconBefore={<Unlink label="unlink icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            isSelected
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            appearance="primary"
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            spacing="none"
            isDisabled
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            appearance="subtle"
            spacing="none"
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            appearance="subtle-link"
            spacing="none"
            iconBefore={<Open label="open icon" />}
          />
          <Button
            {...extraProps}
            appearance="help"
            spacing="none"
            iconBefore={<Open label="open icon" />}
          />
        </div>
        <span> No spacing buttons with only icons </span>
      </div>
    </div>
  );

  return (
    <div>
      <style>{css}</style>
      <div className="container" style={{ width: '100%' }}>
        {createSample({
          backgroundColor: 'white',
        })}
        {createSample({
          backgroundColor: colors.N20,
        })}
      </div>
    </div>
  );
};

const buildStory = props => () => (
  <div style={{ padding: '10px' }}>
    <style>{css}</style>
    <style>{'.sample { background-color: white }'}</style>
    <div className="container">
      <div className="sample">
        <Button {...props}>Create Issue</Button>
        <span>no extra attrs</span>
      </div>

      <div className="sample">
        <Button {...props} href="//www.atlassian.com">
          Create Issue
        </Button>
        <span>with href attribute</span>
      </div>

      <div className="sample">
        <Button {...props} href="//www.atlassian.com">
          Create Issue
        </Button>
        <span>with href attribute + no target</span>
      </div>

      <div className="sample">
        <span>
          text
          <Button {...props} onClick={action('clicking the Component')}>
            Create Issue
          </Button>
          text
        </span>
        <span>click event + text alignment check</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          isDisabled
          onClick={action('clicking the Component')}
        >
          Disabled Option
        </Button>
        <span>disabled</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          isDisabled
          onClick={action('clicking the Component')}
          href="//www.atlassian.com"
          target="_blank"
        >
          Go to Site
        </Button>
        <span>disabled + href + target</span>
      </div>

      <div className="sample">
        <Button {...props} component={CustomComponent} to="/custom-link">
          With a custom component
        </Button>
      </div>

      <div className="sample">
        <Button {...props} className="purple-border pink-bg">
          Custom classes with crazy colors
        </Button>
        <span>custom classes</span>
      </div>

      <div className="sample">
        <Button {...props} className="truncated">
          Truncated text which is very long and has many words to demonstrate
          truncation
        </Button>
        <span>truncated</span>
      </div>

      <div className="sample">
        <Button {...props} isSelected>
          Selected
        </Button>
        <span>selected</span>
      </div>

      <div className="sample">
        <Button {...props} iconBefore={<Page label="page icon" />}>
          Comment
        </Button>
        <span>button + text with page icon</span>
      </div>

      <div className="sample">
        <span>
          text
          <Button
            {...props}
            iconBefore={<Question label="question icon">Question</Question>}
          >
            Info
          </Button>
          text
        </span>
        <span>button + text with question icon + text alignment check</span>
      </div>

      <div className="sample">
        <span>
          text
          <Button
            {...props}
            isSelected
            iconAfter={<Calendar label="calendar icon" />}
          >
            Pick Date
          </Button>
          text
        </span>
        <span>
          button + text with calendar icon + text alignment check + selected
        </span>
      </div>

      <div className="sample">
        <Button {...props} iconAfter={<Expand label="expand icon" />}>
          Show Options
        </Button>
        <span>button + text with expand icon</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          href="//www.atlassian.com"
          iconBefore={<Page label="page icon" />}
        />
        <span>button with Page icon + href</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          href="//www.atlassian.com"
          target="_blank"
          iconBefore={<Expand label="expand icon" />}
        />
        <span>button with icons + href + target</span>
      </div>

      <div className="sample">
        <span>
          text
          <Button {...props} iconBefore={<Calendar label="calendar icon" />} />
          text
        </span>
        <span>button with Calendar icon + text alignment check</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          isSelected
          iconBefore={<Question label="question icon">Question</Question>}
        />
        <span>button with Question icon + selected</span>
      </div>

      <div className="sample">
        <div className="ButtonContainer">
          <style>
            {
              '.ButtonContainer > a, .ButtonContainer > button, .sample > a, .sample > button { margin-right: 5px }'
            }
          </style>
          <Button
            {...props}
            spacing="none"
            iconBefore={<Unlink label="unlink icon">unlink</Unlink>}
          />
          <Button
            {...props}
            spacing="none"
            isSelected
            iconBefore={<Unlink label="unlink icon">unlink selected</Unlink>}
          />
          <Button
            {...props}
            spacing="none"
            iconBefore={<Open label="open icon">open</Open>}
          />
          <Button
            {...props}
            spacing="none"
            isSelected
            iconBefore={<Open label="open icon">open selected</Open>}
          />
        </div>
        <span>button with icons, no spacing &amp; selected</span>
      </div>

      <div className="sample">
        <Button {...props} spacing="compact">
          Create Issue
        </Button>
        <span>compact</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          onClick={action('clicking the Component')}
          spacing="compact"
          isDisabled
        >
          Disabled Option
        </Button>
        <span>compact + disabled</span>
      </div>

      <div className="sample">
        <Button {...props} spacing="compact" isSelected>
          Selected Option
        </Button>
        <span>compact + selected</span>
      </div>

      <div className="sample">
        <Button {...props} shouldFitContainer>
          Create Issue
        </Button>
        <span>shouldFitContainer</span>
      </div>

      <div className="sample">
        <Button
          {...props}
          iconBefore={<Page label="page icon" />}
          shouldFitContainer
        >
          Comment
        </Button>
        <span>shouldFitContainer with page icon</span>
      </div>
    </div>
  </div>
);

const Row = props => <div style={{ padding: 8 }} {...props} />;

storiesOf(name, module)
  .add('standard states', buildStory({ appearance: 'default' }))
  .add('primary states', buildStory({ appearance: 'primary' }))
  .add('warning states', buildStory({ appearance: 'warning' }))
  .add('danger states', buildStory({ appearance: 'danger' }))
  .add('subtle states', buildStory({ appearance: 'subtle' }))
  .add('link states', buildStory({ appearance: 'link' }))
  .add('subtle-link states', buildStory({ appearance: 'subtle-link' }))
  .add('help states', buildStory({ appearance: 'help' }))
  .add('different backgrounds', buildBackgroundStory)
  .add('button group', () => (
    <Row>
      <Row>
        <ButtonGroup>
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup>
          <Button appearance="primary">Alpha</Button>
          <Button appearance="default">Beta</Button>
          <Button appearance="help">Delta</Button>
          <Button appearance="link">Gamma</Button>
          <Button appearance="link">Delta</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup appearance="subtle">
          <Button>Angular</Button>
          <Button>Ember</Button>
          <Button>React</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup>
          <span>children</span>
          <em>must be of type</em>
          <strong>Button</strong>
        </ButtonGroup>
      </Row>
    </Row>
  ))
  .add('with truncation', () => (
    <NarrowWrapper>
      <div>
        <Button appearance="primary">I am wider than my parent</Button>
      </div>
      <div>
        <Button
          appearance="primary"
          iconBefore={<Question label="Icon before" />}
        >
          I am wider than my parent
        </Button>
      </div>
      <div>
        <Button appearance="primary" iconAfter={<Expand label="Icon after" />}>
          I am wider than my parent
        </Button>
      </div>
    </NarrowWrapper>
  ))
  .add('disabled onClick events', () => <DisabledButtonEvents />);
