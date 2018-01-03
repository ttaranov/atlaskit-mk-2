// @flow
import React, { PureComponent } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import AkAvatar from '@atlaskit/avatar';
import { MentionList } from '@atlaskit/mention';
import SingleLineTextInput from '@atlaskit/input';
import InlineEdit from '../src';

const keyCodes = {
  up: 38,
  down: 40,
  enter: 13,
};

const avatarStyle = {
  paddingRight: 8,
  display: 'flex',
  maxWidth: '100%',
};

const mentionWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  flex: '1 0 auto',
  maxWidth: '100%',
};

const mentionListWrapperStyle = {
  marginLeft: -8,
  marginTop: 4,
};

const mentions = [
  {
    id: '2234',
    avatarUrl: '//cdn-img.fimfiction.net/user/xb2v-1431833233-195398-64',
    name: 'Jack Sparrow',
    mentionName: 'captainjack',
    presence: {
      status: 'offline',
    },
  },
  {
    id: '55',
    avatarUrl: '//68.media.tumblr.com/avatar_e67523761e14_64.png',
    name: 'Captain Mal',
    mentionName: 'captaintightpants',
    presence: {
      status: 'offline',
      time: '12:57pm',
    },
  },
  {
    id: '11',
    avatarUrl: '//66.media.tumblr.com/avatar_2072eeb45575_64.png',
    name: 'Doctor Who',
    mentionName: 'thedoctor',
    presence: {
      status: 'busy',
    },
  },
  {
    id: '27',
    avatarUrl:
      '//seatfleet.io/system/users/pictures/54a7/6630/7365/6111/ba00/0000/thumb/picard_s5hq_pbvariant.jpg?1420256904',
    name: 'Jean Luc Picard',
    mentionName: 'makeitso',
    presence: {
      status: 'none',
      time: '1:57am',
    },
  },
  {
    id: '1701',
    avatarUrl:
      '//cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/ab/abee9ce4fbd1c9c94b695b16062b8fdf57a21de7_medium.jpg',
    name: 'James T. Kirk',
    mentionName: 'wheresmyshirt',
  },
];

/* eslint-disable react/prop-types */
export default class MentionExample extends PureComponent {
  state = {
    query: null,
    selectedMention: null,
    confirmedMention: null,
    isFocused: false,
  };

  onInputChange = e => {
    this.setState({
      query: e.target.value,
      selectedMention: null,
    });
  };

  onConfirm = () => {
    this.setState(state => ({
      query: null,
      confirmedMention: state.selectedMention,
    }));
  };

  onCancel = () => {
    this.setState(state => ({
      query: null,
      selectedMention: state.confirmedMention,
    }));
  };

  onSelection = mention => {
    this.setState({
      query: null,
      selectedMention: mention,
    });
  };

  onKeyDown = ({ keyCode }) => {
    if (this.isMentionsListVisible()) {
      this.handleKeyDownForMentionList(keyCode);
    } else if (keyCode === keyCodes.down) {
      this.setState({
        query: this.getNameForEditView(),
      });
    }
  };

  getNameForEditView = () => {
    if (this.state.selectedMention) {
      return this.state.selectedMention.name;
    }
    return this.state.query || '';
  };

  getNameForReadView = () =>
    this.state.confirmedMention ? this.state.confirmedMention.name : 'None';

  handleKeyDownForMentionList = keyCode => {
    switch (keyCode) {
      case keyCodes.up:
        this.mentionList.selectPrevious();
        break;
      case keyCodes.down:
        this.mentionList.selectNext();
        break;
      case keyCodes.enter:
        this.mentionList.chooseCurrentSelection();
        break;
      default:
    }
  };

  focus = () => this.setState({ isFocused: true });

  blur = () => this.setState({ isFocused: false });

  isMentionsListVisible = () =>
    this.state.isFocused && this.state.query != null;

  renderInput = ({ isEditing }) => (
    <SingleLineTextInput
      value={isEditing ? this.getNameForEditView() : this.getNameForReadView()}
      isInitiallySelected
      isEditing={isEditing}
      onChange={this.onInputChange}
      onKeyDown={this.onKeyDown}
      onFocus={this.focus}
      onBlur={this.blur}
    />
  );

  renderReadView = () => (
    <div style={mentionWrapperStyle}>
      {this.state.confirmedMention &&
        this.renderAvatar(this.state.confirmedMention)}
      {this.renderInput({ isEditing: false })}
    </div>
  );

  renderEditView = () => (
    <div style={mentionWrapperStyle}>
      {this.state.selectedMention &&
        this.renderAvatar(this.state.selectedMention)}
      {this.renderInput({ isEditing: true })}
    </div>
  );

  renderAvatar = mention => (
    <div style={avatarStyle}>
      <AkAvatar size="small" src={mention.avatarUrl} />
    </div>
  );

  renderMentionsList = () => (
    <InlineDialog open target={this.field}>
      <MentionList
        mentions={mentions}
        onSelection={this.onSelection}
        ref={mentionList => {
          this.mentionList = mentionList;
        }}
      />
    </InlineDialog>
  );

  render() {
    return (
      <div>
        <div
          ref={field => {
            this.field = field;
          }}
        >
          <InlineEdit
            label={this.props.label}
            editView={this.renderEditView()}
            readView={this.renderReadView()}
            areActionButtonsHidden={this.isMentionsListVisible()}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
            {...this.props}
          />
        </div>
        <div style={mentionListWrapperStyle}>
          {this.isMentionsListVisible() && this.renderMentionsList()}
        </div>
      </div>
    );
  }
}
