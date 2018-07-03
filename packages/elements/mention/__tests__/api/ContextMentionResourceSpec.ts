import { parseQueryFromUrl } from '../_test-helpers';

import { MentionDescription } from '../../src/types';
import MentionResource, {
  HttpError,
  MentionProvider,
  MentionResourceConfig,
} from '../../src/api/MentionResource';
import {
  resultC,
  resultCr,
  resultCraig,
  resultPolly,
} from '../_mention-search-results';
import ContextMentionResource from '../../src/api/ContextMentionResource';

describe('ContextMentionResource', () => {
  let mentionProviderMock;
  let resource: ContextMentionResource;
  let resourceWithContainerId: ContextMentionResource;
  let resourceWithContainerIdAndFriends: ContextMentionResource;

  const PARTIAL_CONTEXT = {
    containerId: 'someContainerId',
  };

  const FULL_CONTEXT = {
    containerId: 'someContainerId',
    objectId: 'someObjectId',
    childObjectId: 'someChildObjectId',
  };

  beforeEach(() => {
    mentionProviderMock = {
      filter: jest.fn(),
      recordMentionSelection: jest.fn(),

      shouldHighlightMention: jest.fn(),
      isFiltering: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    resource = new ContextMentionResource(mentionProviderMock);
    resourceWithContainerId = new ContextMentionResource(mentionProviderMock, {
      containerId: 'someContainerId',
    });
    resourceWithContainerIdAndFriends = new ContextMentionResource(
      mentionProviderMock,
      FULL_CONTEXT,
    );
  });

  afterEach(() => {});

  describe('MentionProvider.filter', () => {
    it('filter should be called without containerId/objectId', () => {
      resource.filter('craig');
      expect(mentionProviderMock.filter).toBeCalledWith('craig');
    });

    it('filter should be called with containerId', () => {
      resourceWithContainerId.filter('craig');
      expect(mentionProviderMock.filter).toBeCalledWith(
        'craig',
        PARTIAL_CONTEXT,
      );
    });

    it('filter should be called with containerId/objectId', () => {
      resourceWithContainerIdAndFriends.filter('craig');
      expect(mentionProviderMock.filter).toBeCalledWith('craig', FULL_CONTEXT);
    });
  });

  describe('MentionProvider.recordMentionSelection', () => {
    it('recordMentionSelection should be called without containerId/objectId', () => {
      resource.recordMentionSelection({ id: '666' });
      expect(mentionProviderMock.recordMentionSelection).toBeCalledWith({
        id: '666',
      });
    });

    it('recordMentionSelection should be called with containerId', () => {
      resourceWithContainerId.recordMentionSelection({ id: '666' });
      expect(mentionProviderMock.recordMentionSelection).toBeCalledWith(
        { id: '666' },
        PARTIAL_CONTEXT,
      );
    });

    it('recordMentionSelection should be called with containerId/objectId', () => {
      resourceWithContainerIdAndFriends.recordMentionSelection({ id: '666' });
      expect(mentionProviderMock.recordMentionSelection).toBeCalledWith(
        { id: '666' },
        FULL_CONTEXT,
      );
    });
  });

  describe('MentionProvider functions that should ignore containerId/objectId', () => {
    it('isFiltering should ignore containerId/objectId', () => {
      mentionProviderMock.isFiltering.mockReturnValue(true);
      expect(resource.isFiltering('craig')).toBeTruthy();
    });

    it('shouldHighlightMention should ignore containerId/objectId', () => {
      mentionProviderMock.shouldHighlightMention.mockReturnValue(true);
      expect(resource.shouldHighlightMention({ id: '123' })).toBeTruthy();
    });

    it('subscribe should ignore containerId/objectId', () => {
      const subscribeCallback = jest.fn();
      resource.subscribe('boo', subscribeCallback);
      expect(mentionProviderMock.subscribe).toBeCalledWith(
        'boo',
        subscribeCallback,
      );
    });

    it('unsubscribe should ignore containerId/objectId', () => {
      resource.unsubscribe('boo');
      expect(mentionProviderMock.unsubscribe).toBeCalledWith('boo');
    });
  });
});
