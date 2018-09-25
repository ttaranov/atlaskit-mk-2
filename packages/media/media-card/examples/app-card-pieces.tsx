/* tslint:disable:no-console */
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import {
  AppCardView,
  AppCardModel,
  AppCardDetails,
  AppCardBadge,
  AppCardLozenge,
  AppCardContext,
  AppCardAction,
  AppCardUser,
} from '../src/app_2/AppCardViewV2';
import { FixedWidthContainer, Section } from './app-card/styled';

const newDesign = true;

const shortTitle =
  'Sascha Reuter commented on a file: Desktop sidebar states.png';

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius mattis massa, quis ornare orci. Integer congue
rutrum velit, quis euismod eros condimentum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
lobortis nibh id odio egestas luctus. Nunc nulla lacus, congue eu nibh non, imperdiet varius lacus. Nulla sagittis
magna et tincidunt volutpat. Nunc augue lorem, eleifend et tempor ut, malesuada ac lorem. Praesent quis feugiat eros,
et vehicula nibh. Maecenas vehicula commodo nisi, at rutrum ipsum posuere sit amet. Integer sit amet nisl sed ligula
consectetur feugiat non at ligula. Cras dignissim suscipit magna at mattis. Maecenas ante leo, feugiat vestibulum velit
a, commodo finibus velit. Maecenas interdum ullamcorper velit non suscipit. Proin tempor, magna vitae dapibus laoreet,
quam dui convallis lectus, in vestibulum arcu eros eu velit. Quisque vel dolor enim.
`;

const userJonBlower: AppCardUser = {
  icon: {
    url:
      'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
    label: 'Jon Blower',
  },
};
const userJamesNewell: AppCardUser = {
  icon: {
    url:
      'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
    label: 'James Newell',
  },
};
const userScottSimpson: AppCardUser = {
  icon: {
    url:
      'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
    label: 'Scott Simpson',
  },
};
const userSaschaReuter: AppCardUser = {
  icon: {
    url:
      'https://extranet.atlassian.com/download/attachments/2246873520/sreuter-57703-pp-1530510_4271148635152_5186589029777108540_n.jpg',
    label: 'Sascha Reuter',
  },
};

const modelWithShortTitle: AppCardModel = {
  title: { text: shortTitle },
};

const modelWithLoooongTitle: AppCardModel = {
  title: { text: loremIpsum },
};

const modelWithUserInTitle: AppCardModel = {
  ...modelWithShortTitle,
  title: {
    text: shortTitle,
    user: userSaschaReuter,
  },
};

const modelWithLink: AppCardModel = {
  ...modelWithShortTitle,
  link: {
    url: 'https://www.atlassian.com/',
  },
};

const preview = {
  url:
    'https://image.ibb.co/ghKzoF/1a99566b0c8e0589ca327bb1efe0be5ca1419aa8.png',
};
const modelWithPreview: AppCardModel = {
  ...modelWithShortTitle,
  preview,
};

const modelWithTitleAndTextInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [
    {
      title: 'Modified',
      text: '10/5/2017 12:19pm',
    },
  ],
};

const storyImage =
  'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png';
const modelWithIconInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [{ icon: { url: storyImage, label: 'Issue type' } }],
};

const metaBadge: AppCardBadge = {
  value: 101,
  max: 99,
  appearance: 'important',
};
const modelWithBadgeInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [{ badge: metaBadge }],
};

const metaLozenge: AppCardLozenge = {
  text: 'In Progress',
  appearance: 'inprogress',
};
const modelWithLozengeInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [{ lozenge: metaLozenge }],
};

const metaUser = [userJamesNewell];
const modelWithUserInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [{ users: metaUser }],
};

const modelWithDescription: AppCardModel = {
  ...modelWithShortTitle,
  description: { text: loremIpsum },
};

const modelWithTitleInDescription: AppCardModel = {
  ...modelWithShortTitle,
  description: { title: 'Lorem Ipsum', text: loremIpsum },
};

const metaUsers = [userJamesNewell, userJonBlower, userScottSimpson];
const modelWithUsersInDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [{ users: metaUsers }],
};

const lotsOfMeta: AppCardDetails[] = [
  { icon: { url: storyImage, label: 'Issue type' }, text: 'Story' },
  { badge: metaBadge },
  { lozenge: metaLozenge },
  { title: 'Watchers', users: metaUsers },
];
const modelWithLotsOfDetails: AppCardModel = {
  ...modelWithShortTitle,
  details: [...lotsOfMeta, ...lotsOfMeta, ...lotsOfMeta, { text: loremIpsum }],
};

const minimalContext: AppCardContext = {
  text: 'Design Home / ... / Media Cards Design',
};

const modelWithContext: AppCardModel = {
  ...modelWithShortTitle,
  context: {
    ...minimalContext,
  },
};

const contextIcon =
  'https://image.ibb.co/jSrC8F/f4b5e33d6b1d36556114a18b594768f41f32673e.png';
const modelWithIconInContext: AppCardModel = {
  ...modelWithShortTitle,
  context: {
    ...minimalContext,
    icon: {
      url: contextIcon,
      label: 'App name',
    },
  },
};

const modelWithLinkInContext: AppCardModel = {
  ...modelWithShortTitle,
  context: {
    ...minimalContext,
  },
};

const primaryAction: AppCardAction = {
  title: 'View',
  target: {
    key: 'test.target.action',
  },
};
const detailsWithPrimaryAction: AppCardModel = {
  ...modelWithShortTitle,
  actions: [primaryAction],
};

const metaActions: AppCardAction[] = [
  primaryAction,
  {
    title: 'Open',
    target: {
      receiver: 'some.receiver1',
      key: 'test.target.open',
    },
    parameters: {
      expenseId: 'some-id1',
    },
  },
  {
    title: 'Join',
    target: {
      receiver: 'some.receiver2',
      key: 'test.target.join',
    },
    parameters: {
      expenseId: 'some-id2',
    },
  },
  {
    title: 'Reply',
    target: {
      receiver: 'some.receiver3',
      key: 'test.target.reply',
    },
    parameters: {
      expenseId: 'some-id3',
    },
  },
];

const loadingStatesActions: AppCardAction[] = [
  {
    title: 'Success',
    target: {
      receiver: 'some.receiver2',
      key: 'success',
    },
    parameters: {
      expenseId: 'some-id2',
    },
  },
  {
    title: 'Failure',
    target: {
      receiver: 'some.receiver1',
      key: 'failure',
    },
    parameters: {
      expenseId: 'some-id1',
    },
  },
  {
    title: 'Loading',
    target: {
      receiver: 'some.receiver3',
      key: 'loading',
    },
    parameters: {
      expenseId: 'some-id3',
    },
  },
  {
    title: 'Failure with try again button',
    target: {
      receiver: 'some.receiver1',
      key: 'failure-with-retry',
    },
    parameters: {
      expenseId: 'some-id1',
    },
  },
];

const detailsWithSecondaryActions: AppCardModel = {
  ...modelWithShortTitle,
  actions: metaActions,
};

const background = {
  url:
    'https://image.ibb.co/grZX8F/aabf3aedb97e60bf38525db46a87ac98323eb68d.png',
};
const modelWithBackground: AppCardModel = {
  ...modelWithShortTitle,
  background,
};

const modelWithMostOfTheThings: AppCardModel = {
  ...modelWithShortTitle,
  description: { title: 'Can haz description', text: loremIpsum },
  details: [...lotsOfMeta, ...lotsOfMeta, ...lotsOfMeta],
  context: {
    ...minimalContext,
    icon: { url: contextIcon, label: 'foobar' },
  },
  actions: metaActions,
};

const mostOfTheThingsWithPreview: AppCardModel = {
  ...modelWithMostOfTheThings,
  preview,
};

const modelWithMostOfTheThingsAndWithBackground: AppCardModel = {
  ...modelWithMostOfTheThings,
  background,
};

const handleClick = () => console.log('clicked on the card');
const handleActionClick = (a: AppCardAction) =>
  console.log('clicked on the action', a.title, a);
const handleActionWithLoadingStatesClick = (
  a: AppCardAction,
  handlers: any,
) => {
  console.log('clicked on the action', a.title, a);
  handlers.progress();
  switch (a.target.key) {
    case 'success':
      setTimeout(() => {
        handlers.success('Yey. It works.');
      }, 2000);
      break;
    case 'failure':
      setTimeout(() => {
        handlers.failure('There is a glitch.');
      }, 2000);
      break;
    case 'loading':
      setTimeout(() => {
        handlers.success();
      }, 2000);
      break;
    case 'failure-with-retry':
      setTimeout(() => {
        handlers.failure('Some error', true, 'Try again btn text');
      }, 2000);
      break;
  }
};

export default () => (
  <IntlProvider>
    <div>
      <div>
        <h1>AppCardView: Pieces</h1>
        <Section title="With context">
          <AppCardView model={modelWithContext} />
          <AppCardView newDesign={newDesign} model={modelWithContext} />
          <AppCardView model={modelWithIconInContext} />
          <AppCardView newDesign={newDesign} model={modelWithIconInContext} />
          <AppCardView model={modelWithLinkInContext} />
          <AppCardView newDesign={newDesign} model={modelWithLinkInContext} />
        </Section>

        <Section title="With link">
          <AppCardView model={modelWithLink} />
          <AppCardView newDesign={newDesign} model={modelWithLink} />
        </Section>

        <Section title="With title">
          <AppCardView model={modelWithShortTitle} />
          <AppCardView newDesign={newDesign} model={modelWithShortTitle} />
          <AppCardView model={modelWithLoooongTitle} />
          <AppCardView newDesign={newDesign} model={modelWithLoooongTitle} />
        </Section>

        <Section title="With description">
          <AppCardView model={modelWithDescription} />
          <AppCardView newDesign={newDesign} model={modelWithDescription} />
          <AppCardView model={modelWithTitleInDescription} />
          <AppCardView
            newDesign={newDesign}
            model={modelWithTitleInDescription}
          />
        </Section>

        <Section title="With user">
          <AppCardView model={modelWithUserInTitle} />
          <AppCardView newDesign={newDesign} model={modelWithUserInTitle} />
        </Section>

        <Section title="With preview">
          <AppCardView model={modelWithPreview} />
          <AppCardView newDesign={newDesign} model={modelWithPreview} />
          <AppCardView model={mostOfTheThingsWithPreview} />
          <AppCardView
            newDesign={newDesign}
            model={mostOfTheThingsWithPreview}
          />
        </Section>

        <Section title="With details">
          <AppCardView model={modelWithTitleAndTextInDetails} />
          <AppCardView
            newDesign={newDesign}
            model={modelWithTitleAndTextInDetails}
          />
          <AppCardView model={modelWithIconInDetails} />
          <AppCardView newDesign={newDesign} model={modelWithIconInDetails} />
          <AppCardView model={modelWithBadgeInDetails} />
          <AppCardView newDesign={newDesign} model={modelWithBadgeInDetails} />
          <AppCardView model={modelWithLozengeInDetails} />
          <AppCardView
            newDesign={newDesign}
            model={modelWithLozengeInDetails}
          />
          <AppCardView model={modelWithUserInDetails} />
          <AppCardView newDesign={newDesign} model={modelWithUserInDetails} />
          <AppCardView model={modelWithUsersInDetails} />
          <AppCardView newDesign={newDesign} model={modelWithUsersInDetails} />
          <AppCardView model={modelWithLotsOfDetails} />
          <AppCardView newDesign={newDesign} model={modelWithLotsOfDetails} />
        </Section>

        <Section title="With actions">
          <AppCardView model={detailsWithPrimaryAction} />
          <AppCardView newDesign={newDesign} model={detailsWithPrimaryAction} />
          <AppCardView model={detailsWithSecondaryActions} />
          <AppCardView
            newDesign={newDesign}
            model={detailsWithSecondaryActions}
          />
        </Section>

        <Section title="With background">
          <AppCardView model={modelWithBackground} />
          <AppCardView newDesign={newDesign} model={modelWithBackground} />
          <AppCardView model={modelWithMostOfTheThingsAndWithBackground} />
          <AppCardView
            newDesign={newDesign}
            model={modelWithMostOfTheThingsAndWithBackground}
          />
        </Section>

        <Section title="With handlers">
          <AppCardView
            model={modelWithShortTitle}
            onClick={handleClick}
            onActionClick={handleActionClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={modelWithBackground}
            onClick={handleClick}
            onActionClick={handleActionClick}
          />
          <AppCardView
            model={modelWithMostOfTheThings}
            onClick={handleClick}
            onActionClick={handleActionClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={modelWithMostOfTheThings}
            onClick={handleClick}
            onActionClick={handleActionClick}
          />
        </Section>

        <FixedWidthContainer>
          <Section title="In a container">
            <AppCardView model={{ title: { text: 'Short title' } }} />
            <AppCardView
              newDesign={newDesign}
              model={{ title: { text: 'Short title' } }}
            />
            <AppCardView
              model={{
                title: {
                  text:
                    'Just long enough to wrap inside the container: blah blah blah',
                },
              }}
            />
            <AppCardView
              newDesign={newDesign}
              model={{
                title: {
                  text:
                    'Just long enough to wrap inside the container: blah blah blah',
                },
              }}
            />
            <AppCardView
              model={{
                title: {
                  text: `Super long title, longer than the card max-width: ${loremIpsum}`,
                },
              }}
            />
            <AppCardView
              newDesign={newDesign}
              model={{
                title: {
                  text: `Super long title, longer than the card max-width: ${loremIpsum}`,
                },
              }}
            />

            <AppCardView
              model={{
                title: { text: 'Short description' },
                description: { text: 'hi' },
              }}
            />
            <AppCardView
              newDesign={newDesign}
              model={{
                title: { text: 'Short description' },
                description: { text: 'hi' },
              }}
            />
            <AppCardView
              model={{
                title: {
                  text:
                    'Just long enough to wrap inside the container description',
                },
                description: {
                  text:
                    'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah',
                },
              }}
            />
            <AppCardView
              newDesign={newDesign}
              model={{
                title: {
                  text:
                    'Just long enough to wrap inside the container description',
                },
                description: {
                  text:
                    'blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah',
                },
              }}
            />
            <AppCardView
              model={{
                title: { text: `Super long description` },
                description: { text: loremIpsum },
              }}
            />
            <AppCardView
              newDesign={newDesign}
              model={{
                title: { text: `Super long description` },
                description: { text: loremIpsum },
              }}
            />

            <AppCardView model={modelWithLotsOfDetails} />
            <AppCardView newDesign={newDesign} model={modelWithLotsOfDetails} />
            <AppCardView model={{ preview, ...modelWithLotsOfDetails }} />
            <AppCardView
              newDesign={newDesign}
              model={{ preview, ...modelWithLotsOfDetails }}
            />
          </Section>
        </FixedWidthContainer>

        <Section title="With loading states">
          <AppCardView
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions.slice(0, 1),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions.slice(0, 1),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions.slice(0, 2),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions.slice(0, 2),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions,
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThings,
              actions: loadingStatesActions,
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions.slice(0, 1),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions.slice(0, 1),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions.slice(0, 2),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions.slice(0, 2),
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions,
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions,
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
          <AppCardView
            newDesign={newDesign}
            model={{
              ...modelWithMostOfTheThingsAndWithBackground,
              actions: loadingStatesActions,
            }}
            onClick={handleClick}
            onActionClick={handleActionWithLoadingStatesClick}
          />
        </Section>
      </div>
    </div>
  </IntlProvider>
);
