import { EmojiPicker, EmojiProvider } from '@atlaskit/emoji';
import Layer from '@atlaskit/layer';
import { borderRadius, colors } from '@atlaskit/theme';
import * as cx from 'classnames';
import * as React from 'react';
import { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';
import { style } from 'typestyle';
import { Selector } from './Selector';
import { Trigger } from './Trigger';

const akBorderRadius = `${borderRadius()}px`;
const akColorN0 = colors.N0;
const akColorN50A = colors.N50A;
const akColorN60A = colors.N60A;

export interface Props {
  emojiProvider: Promise<EmojiProvider>;
  onSelection: (
    emojiId: string,
    source: 'quickSelector' | 'emojiPicker',
  ) => void;
  miniMode?: boolean;
  boundariesElement?: string;
  className?: string;
  allowAllEmojis?: boolean;
  disabled?: boolean;
  onOpen?: () => void;
  onCancel?: () => void;
  onMore?: () => void;
}

export interface State {
  isOpen: boolean;
  showFullPicker?: boolean;
}

const pickerStyle = style({
  verticalAlign: 'middle',
  $nest: {
    '&.miniMode': {
      display: 'inline-block',
      marginRight: '4px',
    },
  },
});

const contentStyle = style({
  display: 'flex',
});

const popupStyle = style({
  background: akColorN0,
  borderRadius: akBorderRadius,
  boxShadow: `0 4px 8px -2px ${akColorN50A}, 0 0 1px ${akColorN60A}`,

  $nest: {
    '&> div': {
      boxShadow: undefined,
    },
  },
});

export class ReactionPicker extends PureComponent<Props, State> {
  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      showFullPicker: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = e => {
    const { isOpen } = this.state;
    if (!isOpen) {
      return;
    }

    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || (e.target instanceof Node && !domNode.contains(e.target))) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
      this.close();
    }
  };

  private close(emojiId?: string) {
    this.setState({
      isOpen: false,
      showFullPicker: false,
    });
  }

  private showFullPicker = e => {
    e.preventDefault();
    const { onMore } = this.props;
    if (onMore) {
      onMore();
    }
    this.setState({
      isOpen: true,
      showFullPicker: true,
    });
  };

  private renderSelector() {
    const { emojiProvider, allowAllEmojis } = this.props;

    return (
      <div className={contentStyle}>
        <Selector
          emojiProvider={emojiProvider}
          onSelection={this.onEmojiSelected}
          showMore={allowAllEmojis}
          onMoreClick={this.showFullPicker}
        />
      </div>
    );
  }

  private renderEmojiPicker() {
    return (
      <EmojiPicker
        emojiProvider={this.props.emojiProvider}
        onSelection={this.onEmojiSelected}
      />
    );
  }

  private renderContent() {
    return this.state.showFullPicker
      ? this.renderEmojiPicker()
      : this.renderSelector();
  }

  private onEmojiSelected = emoji => {
    const { onSelection } = this.props;

    onSelection(
      emoji.id,
      this.state.showFullPicker ? 'emojiPicker' : 'quickSelector',
    );
    this.close(emoji.id);
  };

  private onTriggerClick = () => {
    if (this.props.onOpen) {
      this.props.onOpen();
    }
    this.setState({
      isOpen: !this.state.isOpen,
      showFullPicker: false,
    });
  };

  private renderPopup() {
    if (this.state.isOpen) {
      return <div className={popupStyle}>{this.renderContent()}</div>;
    }

    return null;
  }

  private renderTrigger(content) {
    const { miniMode } = this.props;

    return (
      <Layer
        content={content}
        position="bottom left"
        autoFlip={['top', 'bottom']}
        boundariesElement="scrollParent"
      >
        <Trigger
          onClick={this.onTriggerClick}
          miniMode={miniMode}
          disabled={this.props.disabled}
        />
      </Layer>
    );
  }

  render() {
    const { isOpen } = this.state;
    const { miniMode } = this.props;
    const classNames = cx(
      pickerStyle,
      {
        isOpen: isOpen,
        miniMode: miniMode,
      },
      this.props.className,
    );

    return (
      <div className={classNames}>{this.renderTrigger(this.renderPopup())}</div>
    );
  }
}
