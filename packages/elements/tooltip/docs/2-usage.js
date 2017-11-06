// @flow
import React, { Component, type ComponentType } from 'react';
import { md } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import ArrowDownCircleIcon from '@atlaskit/icon/glyph/arrow-down-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import ArrowUpCircleIcon from '@atlaskit/icon/glyph/arrow-up-circle';

import Tooltip from '../src';
import Wysiwyg from '../examples/wysiwyg';

const POSITIONS = {
  top: {
    icon: <ArrowUpCircleIcon label="Arrow up circle icon" />,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  right: {
    icon: <ArrowRightCircleIcon label="Arrow right circle icon" />,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  bottom: {
    icon: <ArrowDownCircleIcon label="Arrow down circle icon" />,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  left: {
    icon: <ArrowLeftCircleIcon label="Arrow left circle icon" />,
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

// unique enough id
function getUEID() {
  return Math.random().toString(32).slice(2);
}

const Example = ({ component: Tag }: { component: ComponentType<*> }) => (
  <div style={{ marginTop: '0.9em' }}>
    <Tag />
  </div>
);
const Checkbox = ({ children, onChange }: { children: string, onChange: (Event) => void }) => {
  const id = getUEID();

  return (
    <label htmlFor={id} style={{ display: 'inline-block', marginBottom: 10 }}>
      <input
        id={id}
        type="checkbox"
        style={{ marginRight: 8 }}
        onChange={onChange}
      />
      {children}
    </label>
  );
};

class Image extends Component<{}, { truncate: boolean }> {
  state = { truncate: false }
  toggle = () => this.setState(state => ({ truncate: !state.truncate }))
  render() {
    const { truncate } = this.state;

    /* eslint-disable max-len */
    const content = 'The red panda (Ailurus fulgens), also called the lesser panda, the red bear-cat, and the red cat-bear, is a mammal native to the eastern Himalayas and southwestern China.';
    const srcSmiling = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Red_Panda_in_a_Gingko_tree.jpg/220px-Red_Panda_in_a_Gingko_tree.jpg ';
    const srcWalking = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/RedPandaFullBody.JPG/440px-RedPandaFullBody.JPG';
    /* eslint-enable max-len */

    return (
      <div>
        <Checkbox onChange={this.toggle}>
          Truncate text
        </Checkbox>
        <div style={{ display: 'flex' }}>
          <Tooltip content={content} truncate={truncate}>
            <img alt="Red panda - smiling" src={srcSmiling} style={{ borderRadius: 4, marginRight: 4 }} width="220" />
          </Tooltip>
          <Tooltip content="At the Cincinati Zoo" truncate={truncate}>
            <img alt="Red panda - walking" src={srcWalking} style={{ borderRadius: 4 }} width="220" />
          </Tooltip>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line
class Flip extends Component<{}, { active: boolean }> {
  state = { active: false }
  toggle = () => this.setState(state => ({ active: !state.active }))
  render() {
    const { active } = this.state;
    const wrapperStyle = {
      display: 'flex',
      height: 20,
      justifyContent: 'space-between',
      marginTop: '1em',
      maxWidth: 300,
    };

    return (
      <div>
        <Checkbox onChange={this.toggle}>
          Fix to viewport
        </Checkbox>
        <div style={wrapperStyle}>
          {Object.keys(POSITIONS).map(p => {
            const { icon, ...styles } = POSITIONS[p];
            const style = {
              ...styles,
              [p]: 8,
              color: colors.R300,
              position: 'fixed',
              zIndex: 1001,
            };
            return (
              <div key={p} style={active ? style : { color: colors.G300 }}>
                <Tooltip placement={p} content={`Content "${p}"`}>
                  {icon}
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default md`
  ### WYSIWYG

  Use me like you love me.

  ${<Example component={Wysiwyg} />}

  ### Flip Behaviour

  Sometimes you can't be sure where your tooltip be end up. That's okay, we'll
  flip the placement when applicable and make sure it's visible to the user.

  ${<Example component={Flip} />}

  ### Truncate text

  Sometimes you will need to render more text than fits comforably on one line.
  Decide whether you want it to wrap or be truncated.

  ${<Example component={Image} />}
`;
