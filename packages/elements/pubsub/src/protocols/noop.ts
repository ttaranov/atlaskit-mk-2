import { Protocol, ProtocolConfig } from '../types';
import { OnEvent } from '../apiTypes';
import { EventType } from '../types';

export default class NoopProtocol implements Protocol {
  getType(): string {
    return 'noop';
  }

  subscribe(config: ProtocolConfig): void {}

  unsubscribeAll(): void {}

  getCapabilities(): string[] {
    return [];
  }

  on(event: EventType, handler: OnEvent): void {}

  off(event: EventType, handler: OnEvent): void {}

  networkUp(): void {}

  networkDown(): void {}
}
