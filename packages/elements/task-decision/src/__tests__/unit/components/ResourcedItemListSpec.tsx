import * as React from 'react';
import { mount } from 'enzyme';
import { waitUntil } from '@atlaskit/util-common-test';
import Button from '@atlaskit/button';

import { Item, Query } from '../../../types';
import { getFormattedDate } from '../../../util/date';
import ResourcedItemList from '../../../components/ResourcedItemList';
import DecisionItem from '../../../components/DecisionItem';
import ResourcedTaskItem from '../../../components/ResourcedTaskItem';
import TaskItem from '../../../components/TaskItem';

import {
  buildDecision,
  buildItemResponse,
  buildTask,
  content,
  datePlus,
  getItemsResponse,
  getItemsResponseWithParticipants,
} from '../_test-data';

const query: Query = {
  containerAri: 'cheese',
};

const countType = (items: Item[], type: string) =>
  items.filter(item => item.type === type).length;

const decisionItemsRendered = (component, count) =>
  component.update() && component.find(DecisionItem).length === count;

describe('<ResourcedItemList/>', () => {
  const defaultResponse = getItemsResponse();
  let provider;
  let renderer;

  beforeEach(() => {
    provider = {
      getItems: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };
    (renderer = jest.fn()), renderer.mockImplementation(() => <div />);
  });

  describe('ungrouped', () => {
    it('should render both types of items', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve(defaultResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      const decisionCount = countType(defaultResponse.items, 'DECISION');
      const taskCount = countType(defaultResponse.items, 'TASK');
      return waitUntil(() =>
        decisionItemsRendered(component, decisionCount),
      ).then(() => {
        expect(component.find(DecisionItem).length).toBe(decisionCount);
        expect(component.find(ResourcedTaskItem).length).toBe(taskCount);
        const moreButton = component.find(Button);
        expect(moreButton.length).toBe(0);
        expect(renderer.mock.calls.length > 0).toBe(true);
        const firstRenderCall = renderer.mock.calls[0];
        const context = firstRenderCall[1];
        expect(context).toEqual({
          containerAri: defaultResponse.items[0].containerAri,
          objectAri: defaultResponse.items[0].objectAri,
        });
      });
    });

    // it('should show more option if response contains nextQuery and call again on selection', () => {
    //   const firstResponse = getItemsResponse(true);
    //   const secondResponse = getItemsResponse(false, 1);
    //   provider.getItems.onFirstCall().returns(Promise.resolve(firstResponse));
    //   provider.getItems.onSecondCall().returns(Promise.resolve(secondResponse));
    //   const component = mount(
    //     <ResourcedItemList initialQuery={query} taskDecisionProvider={provider} renderDocument={renderer} />
    //   );
    //   const decisionCount = countType(defaultResponse.items, 'DECISION');
    //   const taskCount = countType(defaultResponse.items, 'TASK');
    //   return waitUntil(() => decisionItemsRendered(component, decisionCount)).then(() => {
    //     expect(component.find(DecisionItem).length).toBe(decisionCount);
    //     expect(component.find(ResourcedTaskItem).length).toBe(taskCount);
    //     const moreButton = component.find(Button);
    //     expect(moreButton.length).toBe(1);
    //     moreButton.simulate('click');
    //     return waitUntil(() => decisionItemsRendered(component, decisionCount * 2));
    //   }).then(() => {
    //     expect(component.find(DecisionItem).length).toBe(decisionCount * 2);
    //     expect(component.find(ResourcedTaskItem).length).toBe(typeCount * 2);
    //     const moreButton = component.find(Button);
    //     expect(moreButton.length).toBe(0);
    //   });
    // });
  });

  describe('group by', () => {
    const performDateTest = (testQuery: Query, dateField: string) => {
      const response = getItemsResponse({ groupByDateSize: 4, dateField });
      provider.getItems.mockImplementation(() => Promise.resolve(response));
      const component = mount(
        <ResourcedItemList
          initialQuery={testQuery}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
          groupItems={true}
        />,
      );
      const decisionCount = countType(defaultResponse.items, 'DECISION');
      const taskCount = countType(defaultResponse.items, 'TASK');
      expect(decisionCount).toBe(5);
      expect(taskCount).toBe(5);
      return waitUntil(() =>
        decisionItemsRendered(component, decisionCount),
      ).then(() => {
        expect(component.find(DecisionItem).length).toBe(decisionCount);
        expect(component.find(ResourcedTaskItem).length).toBe(taskCount);
        const moreButton = component.find(Button);
        expect(moreButton.length).toBe(0);

        const dateGroups = component
          .find('ol')
          .first()
          .children('li');
        expect(dateGroups.length).toBe(3);
        // Group 1 - Today
        const dateGroup1 = dateGroups.at(0);
        expect(
          dateGroup1
            .find('div')
            .first()
            .text(),
        ).toBe('Today');
        expect(dateGroup1.find(DecisionItem).length).toBe(4);

        // Group 2 - Yesterday
        const dateGroup2 = dateGroups.at(1);
        expect(
          dateGroup2
            .find('div')
            .first()
            .text(),
        ).toBe('Yesterday');
        expect(dateGroup2.find(DecisionItem).length).toBe(1);
        expect(dateGroup2.find(ResourcedTaskItem).length).toBe(3);

        // Group 3 - Two dates ahead
        const dateGroup3 = dateGroups.at(2);
        expect(
          dateGroup3
            .find('div')
            .first()
            .text(),
        ).toBe(getFormattedDate(response.items[8][dateField]));
        expect(dateGroup3.find(ResourcedTaskItem).length).toBe(2);
      });
    };

    it('should group by creationDate, by default', () => {
      const groupByQuery: Query = {
        ...query,
      };
      return performDateTest(groupByQuery, 'creationDate');
    });

    it('should group by creationDate, when specified', () => {
      const groupByQuery: Query = {
        ...query,
        sortCriteria: 'creationDate',
      };
      return performDateTest(groupByQuery, 'creationDate');
    });

    it('should group by lastUpdateDate, when specified', () => {
      const groupByQuery: Query = {
        ...query,
        sortCriteria: 'lastUpdateDate',
      };
      return performDateTest(groupByQuery, 'lastUpdateDate');
    });
  });

  describe('recent updates', () => {
    it('notifyRecentItems should refresh item list', () => {
      // Initial render
      const d1 = buildDecision({
        localId: 'd1',
        lastUpdateDate: datePlus(2),
        content: content('d1'),
      });
      const t1 = buildTask({
        localId: 't1',
        state: 'TODO',
        lastUpdateDate: datePlus(1),
        content: content('t1'),
      });
      const initialResponse = buildItemResponse([d1, t1]);

      const d2 = buildDecision({
        localId: 'd2',
        lastUpdateDate: datePlus(4),
        content: content('d2'),
      });
      const t1update = buildTask({
        localId: 't1',
        state: 'DONE',
        lastUpdateDate: datePlus(3),
        content: content('t1update'),
      });
      const recentUpdatesResponse = buildItemResponse([d2, t1update, d1]);

      const renderer = doc => doc.content[0].content[0].text;

      provider.getItems.mockReturnValueOnce(Promise.resolve(initialResponse));
      provider.getItems.mockReturnValueOnce(
        Promise.resolve(recentUpdatesResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      return waitUntil(() => decisionItemsRendered(component, 1))
        .then(() => {
          expect(component.find(DecisionItem).length).toBe(1);
          expect(component.find(ResourcedTaskItem).length).toBe(1);
          const recentUpdatesListener = provider.getItems.mock.calls[0][1];
          expect(recentUpdatesListener).toBeDefined();
          const recentUpdatesCallback = recentUpdatesListener.recentUpdates;
          expect(recentUpdatesCallback).toBeDefined();

          // notifyRecent items on TaskDecisionResource
          recentUpdatesCallback({
            containerAri: d2.containerAri,
            localId: d2.localId,
          });
          return waitUntil(() => decisionItemsRendered(component, 2));
        })
        .then(() => {
          // New render with new items + new task state
          const items = component.findWhere(
            n => n.is(DecisionItem) || n.is(ResourcedTaskItem),
          );
          expect(items.length).toBe(3);
          const item1 = items.at(0);
          expect(item1.type()).toBe(DecisionItem);
          expect(item1.prop('children')).toBe('d2');
          const item2 = items.at(1);
          expect(item2.type()).toBe(ResourcedTaskItem);
          expect(item2.prop('children')).toBe('t1update');
          const item3 = items.at(2);
          expect(item3.type()).toBe(DecisionItem);
          expect(item3.prop('children')).toBe('d1');
        });
    });

    it('notifyRecentItems should refresh and wait for new item', () => {
      // Initial render
      const d1 = buildDecision({
        localId: 'd1',
        lastUpdateDate: datePlus(2),
        content: content('d1'),
      });
      const t1 = buildTask({
        localId: 't1',
        state: 'TODO',
        lastUpdateDate: datePlus(1),
        content: content('t1'),
      });
      const initialResponse = buildItemResponse([d1, t1]);

      const d2 = buildDecision({
        localId: 'd2',
        lastUpdateDate: datePlus(4),
        content: content('d2'),
      });
      const t1update = buildTask({
        localId: 't1',
        state: 'DONE',
        lastUpdateDate: datePlus(3),
        content: content('t1update'),
      });
      const recentUpdatesResponse = buildItemResponse([d2, t1update, d1]);

      const renderer = doc => doc.content[0].content[0].text;

      let currentResponse = initialResponse;
      provider.getItems.mockImplementation(() => {
        return Promise.resolve(currentResponse);
      });
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      return waitUntil(() => decisionItemsRendered(component, 1))
        .then(() => {
          expect(component.find(DecisionItem).length).toBe(1);
          expect(component.find(ResourcedTaskItem).length).toBe(1);

          const recentUpdatesListener = provider.getItems.mock.calls[0][1];
          expect(recentUpdatesListener).toBeDefined();
          const recentUpdatesCallback = recentUpdatesListener.recentUpdates;
          expect(recentUpdatesCallback).toBeDefined();

          recentUpdatesCallback({
            containerAri: d2.containerAri,
            localId: d2.localId,
          });

          // Wait for second call to getItems due to recentUpdate
          return waitUntil(() => provider.getItems.mock.calls.length > 1);
        })
        .then(() => {
          // notifyRecent items on TaskDecisionResource
          const numGetItemsCalled = provider.getItems.mock.calls.length;
          currentResponse = recentUpdatesResponse;

          return waitUntil(
            () => provider.getItems.mock.calls.length === numGetItemsCalled + 1,
          );
        })
        .then(() => {
          return waitUntil(() => decisionItemsRendered(component, 2));
        })
        .then(() => {
          // New render with new items + new task state
          const items = component.findWhere(
            n => n.is(DecisionItem) || n.is(ResourcedTaskItem),
          );
          expect(items.length).toBe(3);
        });
    });
  });

  describe('empty state', () => {
    it('should render empty state component if no results', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve({ items: [] }),
      );
      const emptyComponent = <div className="empty-component" />;
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
          emptyComponent={emptyComponent}
        />,
      );
      return waitUntil(
        () =>
          component.update() && component.find('.empty-component').length > 0,
      ).then(() => {
        expect(component.find('.empty-component').length).toBe(1);
      });
    });

    it('should render no content in component if no results and no emptyState', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve({ items: [] }),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      return waitUntil(
        () => component.update() && component.isEmptyRender(),
      ).then(() => {
        expect(component.isEmptyRender()).toBe(true);
      });
    });
  });

  describe('error state', () => {
    it('should render error state component on error', () => {
      provider.getItems.mockImplementation(() => Promise.reject('bad times'));
      const errorComponent = <div className="error-component" />;
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
          errorComponent={errorComponent}
        />,
      );
      return waitUntil(
        () =>
          component.update() && component.find('.error-component').length > 0,
      ).then(() => {
        expect(component.find('.error-component').length).toBe(1);
      });
    });

    it('should render no content in component if no results and error', () => {
      provider.getItems.mockImplementation(() => Promise.reject('bad times'));
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      return waitUntil(
        () => component.update() && component.isEmptyRender(),
      ).then(() => {
        expect(component.isEmptyRender()).toBe(true);
      });
    });
  });

  describe('prop changes', () => {
    it('initialQuery should clear items immediately, while waiting for new results', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve(defaultResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      let resolver;
      return waitUntil(() => component.state('items').length > 0)
        .then(() => {
          const getItemsPromise = new Promise(resolve => {
            resolver = resolve;
          });
          provider.getItems.mockImplementation(() => getItemsPromise);
          component.setProps({
            initialQuery: { ...query },
          });
          return waitUntil(() => component.state('items').length === 0);
        })
        .then(() => {
          expect(component.state('items').length).toBe(0);
          resolver(defaultResponse);
          return waitUntil(() => component.state('items').length > 0);
        })
        .then(() => {
          expect(component.state('items').length).toBe(
            defaultResponse.items.length,
          );
        });
    });
  });

  describe('participants', () => {
    const participantResponse = getItemsResponseWithParticipants();
    it('participants propogate to items', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve(participantResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      const decisionCount = countType(participantResponse.items, 'DECISION');
      return waitUntil(() =>
        decisionItemsRendered(component, decisionCount),
      ).then(() => {
        // First item (a task) will have 2 participant
        const t1 = participantResponse.items[0];
        expect(t1.type).toBe('TASK');
        expect(t1.participants.length).toBe(2);
        const taskComponent = component.find(TaskItem).at(0);
        expect(taskComponent.prop('participants')).toEqual(t1.participants);

        // Second item (a decision) will have 1 participant
        const d1 = participantResponse.items[1];
        expect(d1.type).toBe('DECISION');
        expect(d1.participants.length).toBe(1);
        const decisionComponent = component.find(DecisionItem).at(0);
        expect(decisionComponent.prop('participants')).toEqual(d1.participants);
      });
    });
  });

  describe('attribution', () => {
    const attributionResponse = getItemsResponseWithParticipants();
    it('creator propogate to items', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve(attributionResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      const decisionCount = countType(attributionResponse.items, 'DECISION');
      return waitUntil(() =>
        decisionItemsRendered(component, decisionCount),
      ).then(() => {
        // First item (a task) will have 2 participant
        const t1 = attributionResponse.items[0];
        expect(t1.type).toBe('TASK');
        expect(t1.creator).toBeDefined();
        const taskComponent = component.find(TaskItem).at(0);
        expect(taskComponent.prop('creator')).toEqual(t1.creator);

        // Second item (a decision) will have 1 participant
        const d1 = attributionResponse.items[1];
        expect(d1.type).toBe('DECISION');
        expect(d1.creator).toBeDefined();
        const decisionComponent = component.find(DecisionItem).at(0);
        expect(decisionComponent.prop('creator')).toEqual(d1.creator);
      });
    });

    it('lastUpdater propogate to items', () => {
      provider.getItems.mockImplementation(() =>
        Promise.resolve(attributionResponse),
      );
      const component = mount(
        <ResourcedItemList
          initialQuery={query}
          taskDecisionProvider={Promise.resolve(provider)}
          renderDocument={renderer}
        />,
      );
      const decisionCount = countType(attributionResponse.items, 'DECISION');
      return waitUntil(() =>
        decisionItemsRendered(component, decisionCount),
      ).then(() => {
        // First item (a task) will have 2 participant
        const t1 = attributionResponse.items[3];
        expect(t1.type).toBe('TASK');
        expect(t1.lastUpdater).toBeDefined();
        const taskComponent = component.find(TaskItem).at(1);
        expect(taskComponent.prop('lastUpdater')).toEqual(t1.lastUpdater);

        // Second item (a decision) will have 1 participant
        const d1 = attributionResponse.items[2];
        expect(d1.type).toBe('DECISION');
        expect(d1.lastUpdater).toBeDefined();
        const decisionComponent = component.find(DecisionItem).at(1);
        expect(decisionComponent.prop('lastUpdater')).toEqual(d1.lastUpdater);
      });
    });
  });
});
