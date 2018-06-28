import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import { ShallowWrapper } from 'enzyme';
import { shallowWithIntl } from 'enzyme-react-intl';
import * as React from 'react';
import { NoAccessLabel } from '../../src/components/i18n';
import MentionItem from '../../src/components/MentionItem';
import { Props, State } from '../../src/components/MentionList';
import { MentionDescription } from '../../src/types';

const mentionWithNickname = {
  id: '0',
  name: 'Raina Halper',
  mentionName: 'Caprice',
  nickname: 'Carolyn',
  avatarUrl: '',
};

const mentionWithoutNickname = {
  id: '1',
  name: 'Kaitlyn Prouty',
  mentionName: 'Fidela',
  avatarUrl: '',
};

function setupMentionItem(
  mention: MentionDescription,
  props?: Props,
): ShallowWrapper<Props, State> {
  return shallowWithIntl(
    <MentionItem mention={mention} onSelection={props && props.onSelection} />,
  ) as ShallowWrapper<Props, State>;
}

describe('MentionItem', () => {
  it('should display @-nickname if nickname is present', () => {
    const component = setupMentionItem(mentionWithNickname);
    expect(component.html()).toContain(`@${mentionWithNickname.nickname}`);
  });

  it('should not display @-name if nickname is not present', () => {
    const component = setupMentionItem(mentionWithoutNickname);
    expect(component.html()).not.toContain('@');
  });

  it('should display access restriction if accessLevel is not CONTAINER', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
      accessLevel: 'SITE',
    });
    const noAccessLabel = component.find(NoAccessLabel);
    expect(noAccessLabel).toHaveLength(1);
    // we need to dive twice because NoAccessLabel wraps FormattedMessage
    // that wraps LookCircleIcon
    expect(
      noAccessLabel
        .dive()
        .dive()
        .find(LockCircleIcon),
    ).toHaveLength(1);
  });

  it('should not display access restriction if accessLevel is CONTAINER', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
      accessLevel: 'CONTAINER',
    });
    expect(component.find(NoAccessLabel)).toHaveLength(0);
  });

  it('should not display access restriction if no accessLevel data', () => {
    const component = setupMentionItem({
      id: '1',
      name: 'Kaitlyn Prouty',
      mentionName: 'Fidela',
      avatarUrl: '',
    });
    expect(component.find(NoAccessLabel)).toHaveLength(0);
  });
});
