import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { AppCardView as OldAppCardView } from '../../../../app';
import { BlockCard } from '@atlaskit/media-ui';
import { AppCardView, AppCardModel } from '../../../AppCardViewV2';

const exampleURL = 'https://www.example.com/test-image.png';

const modelWithTitle = {
  title: {
    text: 'Hello World!',
  },
};

function convertModel(model: AppCardModel) {
  const element = shallow(<AppCardView newDesign={true} model={model} />);
  return element.find(BlockCard.ResolvedView).props();
}

describe('AppCardViewV2', () => {
  it('should not render the old design by default', () => {
    const element = shallow(<AppCardView model={modelWithTitle} />);
    expect(element.find(OldAppCardView)).toHaveLength(1);
    expect(element.find(BlockCard.ResolvedView)).toHaveLength(0);
  });

  it('should not render the old design when newDesign=false', () => {
    const element = shallow(
      <AppCardView newDesign={false} model={modelWithTitle} />,
    );
    expect(element.find(OldAppCardView)).toHaveLength(1);
    expect(element.find(BlockCard.ResolvedView)).toHaveLength(0);
  });

  it('should render the new design when newDesign=true', () => {
    const element = shallow(
      <AppCardView newDesign={true} model={modelWithTitle} />,
    );
    expect(element.find(OldAppCardView)).toHaveLength(0);
    expect(element.find(BlockCard.ResolvedView)).toHaveLength(1);
  });

  it('should not convert context when context is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        context: undefined,
      }),
    );
  });

  it('should convert context with title when context is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        context: {
          text: 'Application',
        },
      }),
    ).toEqual(
      expect.objectContaining({
        context: {
          text: 'Application',
        },
      }),
    );
  });

  it('should convert context with icon when context is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        context: {
          icon: {
            url: exampleURL,
            label: 'test image',
          },
          text: 'Application',
        },
      }),
    ).toEqual(
      expect.objectContaining({
        context: {
          icon: exampleURL,
          text: 'Application',
        },
      }),
    );
  });

  it('should not convert link when link is missing ', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        link: undefined,
      }),
    );
  });

  it('should convert link when link is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        link: {
          url: exampleURL,
        },
      }),
    ).toEqual(
      expect.objectContaining({
        link: exampleURL,
      }),
    );
  });

  it('should convert title when title is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(expect.objectContaining(modelWithTitle));
  });

  it('should not convert description when description is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        description: undefined,
      }),
    );
  });

  it('should convert description when description is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        description: {
          text: 'Lorem ipsum',
        },
      }),
    ).toEqual(
      expect.objectContaining({
        description: {
          text: 'Lorem ipsum',
        },
      }),
    );
  });

  it('should not convert preview when preview is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        preview: undefined,
      }),
    );
  });

  it('should convert preview when preview is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        preview: {
          url: exampleURL,
        },
      }),
    ).toEqual(
      expect.objectContaining({
        preview: exampleURL,
      }),
    );
  });

  it('should not convert missing user when icon is not present in the title', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        user: undefined,
      }),
    );
  });

  it('should convert user when an icon is present in the title', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        title: {
          text: 'Hello World!',
          user: {
            icon: {
              url: exampleURL,
              label: 'bull dust',
            },
          },
        },
      }),
    ).toEqual(
      expect.objectContaining({
        user: {
          icon: exampleURL,
          name: 'bull dust',
        },
      }),
    );
  });

  it('should not convert and concat users when details is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        users: undefined,
      }),
    );
  });

  it('should convert and concat users when details is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        details: [
          {
            users: [
              {
                icon: {
                  url: exampleURL,
                  label: 'bull',
                },
              },
            ],
          },
          {
            users: [
              {
                icon: {
                  url: exampleURL,
                  label: 'dust',
                },
              },
            ],
          },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        users: [
          {
            icon: exampleURL,
            name: 'bull',
          },
          {
            icon: exampleURL,
            name: 'dust',
          },
        ],
      }),
    );
  });

  it('should not convert details when details is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        details: undefined,
      }),
    );
  });

  it('should convert details when details is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        details: [
          {
            title: 'Topic',
            users: [
              {
                icon: {
                  url: exampleURL,
                  label: 'dust',
                },
              },
            ],
            text: 'foobar',
          },
          {
            badge: {
              value: 75,
            },
            icon: {
              url: exampleURL,
              label: '',
            },
          },
          {
            title: 'Status',
            lozenge: {
              text: 'Updated',
            },
          },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        details: [
          {
            title: 'Topic',
            text: 'foobar',
          },
          {
            badge: {
              value: 75,
            },
            icon: exampleURL,
          },
          {
            title: 'Status',
            lozenge: {
              text: 'Updated',
            },
          },
        ],
      }),
    );
  });

  it('should not convert actions when actions is missing', () => {
    expect(
      convertModel({
        ...modelWithTitle,
      }),
    ).toEqual(
      expect.objectContaining({
        actions: undefined,
      }),
    );
  });

  it('should convert actions when actions is present', () => {
    expect(
      convertModel({
        ...modelWithTitle,
        actions: [
          {
            title: 'Reply',
            target: {
              receiver: 'my.first.addon',
              key: 'my.thing',
            },
            parameters: {
              custom: true,
            },
          },
          {
            title: 'View',
            target: {
              receiver: 'my.second.addon',
              key: 'my.other.thing',
            },
            parameters: {
              custom: false,
            },
          },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        actions: [
          {
            id: expect.any(String),
            text: 'Reply',
            handler: expect.any(Function),
          },
          {
            id: expect.any(String),
            text: 'View',
            handler: expect.any(Function),
          },
        ],
      }),
    );
  });

  it('should call onActionClick with the action', () => {
    expect.assertions(1);
    const action = {
      title: 'View',
      target: {
        key: 'abc123',
      },
      parameters: {
        msg: 'foobar',
      },
    };
    const onActionClick = jest.fn();
    const element = mount(
      <AppCardView
        newDesign={true}
        model={{
          ...modelWithTitle,
          actions: [action],
        }}
        onActionClick={onActionClick}
      />,
    );
    element.find('button').simulate('click');
    expect(onActionClick).toBeCalledWith(
      action,
      expect.objectContaining({
        progress: expect.any(Function),
        success: expect.any(Function),
        failure: expect.any(Function),
      }),
    );
  });
});
