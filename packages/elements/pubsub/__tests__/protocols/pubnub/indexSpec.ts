jest.mock('pubnub');
jest.mock('../../../src/protocols/pubnub/pubNubHistoryFetcher');
import * as Pubnub from 'pubnub';
import PubNubProtocol from '../../../src/protocols/pubnub/index';
import HistoryFetcher from '../../../src/protocols/pubnub/pubNubHistoryFetcher';
import { EventType } from '../../../src/types';
import { FeatureFlags } from '../../../src/featureFlags';
import { ConnectionState } from '../../../src/protocols/types';

const mockPubNub = {
  addListener: jest.fn(),
  subscribe: jest.fn(),
  fetchMessages: jest.fn(),
  setAuthKey: jest.fn(),
  setUUID: jest.fn(),
  reconnect: jest.fn(),
};
(Pubnub as any).mockImplementation(() => mockPubNub);

const mockHistoryFetcher = {
  fetch: jest.fn(),
};
(HistoryFetcher as any).mockImplementation(() => mockHistoryFetcher);

jest.useFakeTimers();

function subscribeRequest(
  channels = [''],
  channelGroups = [''],
  subscribeKey = '',
) {
  return {
    type: 'pubnub',
    authKey: '',
    subscribeKey: subscribeKey,
    channels: channels,
    channelGroups: channelGroups,
    filterExpression: '',
    userUuid: '',
  };
}

describe('PubNub', () => {
  let pubNubProtocol: PubNubProtocol;

  beforeEach(() => {
    pubNubProtocol = new PubNubProtocol(new FeatureFlags({ DRY_RUN: true }));

    (Pubnub as any).mockClear();
    mockPubNub.addListener.mockClear();
    mockPubNub.subscribe.mockClear();
    mockPubNub.fetchMessages.mockClear();
  });

  describe('#subscribe', () => {
    it('should create a new PubNub client', () => {
      pubNubProtocol.subscribe(subscribeRequest());

      expect(Pubnub).toHaveBeenCalled();
    });

    it('should add listener to PubNub client', () => {
      pubNubProtocol.subscribe(subscribeRequest());

      expect(mockPubNub.addListener).toHaveBeenCalled();
    });

    it('should call subscribe on PubNub client', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      expect(mockPubNub.subscribe).toHaveBeenCalledWith({
        channels: ['channel1'],
        channelGroups: ['channelGroup1'],
      });
    });

    it('should not recreate a PubNub client if we can reuse existing one', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      expect(Pubnub).toHaveBeenCalledTimes(1);
    });

    it('should set new authKey when reuse existing PubNub client', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      mockPubNub.setAuthKey.mockClear();
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      expect(mockPubNub.setAuthKey).toHaveBeenCalledTimes(1);
    });

    it('should set new uuid when reuse existing PubNub client', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      mockPubNub.setUUID.mockClear();
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      expect(mockPubNub.setUUID).toHaveBeenCalledTimes(1);
    });

    it('should recreate a PubNub client if we can not reuse existing one', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1'], 'subscribeKey1'),
      );

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1'], 'subscribeKey2'),
      );

      expect(Pubnub).toHaveBeenCalledTimes(2);
    });
  });

  describe('#networkUp', () => {
    it('should call pubnub.reconnect', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      pubNubProtocol.networkUp();

      expect(mockPubNub.reconnect).toHaveBeenCalled();
    });
  });

  describe('#networkDown', () => {
    it('should change connection state to OFFLINE', () => {
      pubNubProtocol.networkDown();

      expect(pubNubProtocol.getConnectionState()).toBe(ConnectionState.OFFLINE);
    });
  });

  describe('#onMessageEvent', () => {
    it('should save last time token', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.message!({
        channel: 'channel1',
        subscription: '',
        timetoken: '666',
        message: {
          version: '1.0',
          messages: [],
        },
        publisher: '',
        actualChannel: '',
        subscribedChannel: '',
      });

      expect(pubNubProtocol.getLastTimeToken()).toEqual('666');
    });

    it('should call message handlers', () => {
      const messageHandler = jest.fn();
      pubNubProtocol.on(EventType.MESSAGE, messageHandler);
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      const messageType = 'messageType';
      const messagePayload = {};
      handlers.message!({
        channel: 'channel1',
        subscription: '',
        timetoken: '666',
        message: {
          version: '1.0',
          messages: [
            {
              type: messageType,
              payload: messagePayload,
            },
          ],
        },
        publisher: '',
        actualChannel: '',
        subscribedChannel: '',
      });

      expect(messageHandler).toHaveBeenCalledWith(messageType, messagePayload);
    });
  });

  describe('on PNConnectedCategory', () => {
    it('should change connection state to CONNECTED', () => {
      const handler = jest.fn();
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.NETWORK_UP, handler);

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNConnectedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(pubNubProtocol.getConnectionState()).toBe(
        ConnectionState.CONNECTED,
      );
    });
  });

  describe('on PNNetworkUpCategory', () => {
    it('should call network up handler', () => {
      const handler = jest.fn();
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.NETWORK_UP, handler);

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNNetworkUpCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('on PNReconnectedCategory', () => {
    it('should call network up handler', () => {
      const handler = jest.fn();
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.NETWORK_UP, handler);

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNReconnectedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('on PNAccessDeniedCategory', () => {
    beforeEach(() => {});

    it('should call error handler', () => {
      const errorHandler = jest.fn();

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.ACCESS_DENIED, errorHandler);
      mockPubNub.subscribe.mockReset();

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNAccessDeniedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      jest.runTimersToTime(100);

      expect(errorHandler).toHaveBeenCalled();
    });

    it('should debounce call to error handler', () => {
      const errorHandler = jest.fn();

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.ACCESS_DENIED, errorHandler);
      mockPubNub.subscribe.mockReset();

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNAccessDeniedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      handlers.status!({
        category: 'PNAccessDeniedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      jest.runTimersToTime(100);

      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('on PNNetworkDownCategory', () => {
    it('should call network down handler', () => {
      const handler = jest.fn();

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.NETWORK_DOWN, handler);

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNConnectedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      handlers.status!({
        category: 'PNNetworkDownCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('on PNNetworkIssuesCategory', () => {
    it('should call network down handler', () => {
      const handler = jest.fn();

      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );
      pubNubProtocol.on(EventType.NETWORK_DOWN, handler);

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNConnectedCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      handlers.status!({
        category: 'PNNetworkIssuesCategory',
        operation: '',
        affectedChannels: ['channel1', 'channel2'],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('on PNRequestMessageCountExceededCategory', () => {
    it('should fetch history', () => {
      pubNubProtocol.subscribe(
        subscribeRequest(['channel1'], ['channelGroup1']),
      );

      const handlers: Pubnub.ListenerParameters =
        mockPubNub.addListener.mock.calls[0][0];
      handlers.status!({
        category: 'PNRequestMessageCountExceededCategory',
        operation: '',
        affectedChannels: [],
        subscribedChannels: [],
        affectedChannelGroups: [],
        lastTimetoken: '',
        currentTimetoken: '',
      });

      expect(mockHistoryFetcher.fetch).toHaveBeenCalled();
    });
  });
});
