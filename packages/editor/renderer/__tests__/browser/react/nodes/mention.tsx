import * as React from 'react';
import { mountWithIntl } from 'enzyme-react-intl';
import { expect } from 'chai';
import { ResourcedMention } from '@atlaskit/mention';
import MentionNode from '../../../../src/react/nodes/mention';
import { Mention } from '@atlaskit/editor-common';

describe('Renderer - React/Nodes/Mention', () => {
  it('should render UI mention component', () => {
    const mention = mountWithIntl(
      <MentionNode id="abcd-abcd-abcd" text="@Oscar Wallhult" />,
    );
    expect(mention.find(Mention)).to.have.length(1);
    mention.unmount();
  });

  it('should render with access level if prop exists', () => {
    const mention = mountWithIntl(
      <MentionNode
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        accessLevel="APPLICATION"
      />,
    );
    expect(mention.find(Mention).prop('accessLevel')).to.equal('APPLICATION');
    mention.unmount();
  });

  it('should pass event handlers into resourced mention', () => {
    const onClick = () => {};

    const eventHandlers = {
      mention: {
        onClick,
      },
    };

    const mention = mountWithIntl(
      <MentionNode
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        eventHandlers={eventHandlers}
      />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('onClick')).to.equal(onClick);
    mention.unmount();
  });
});
