import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  Gateway,
  UsageFrequencyTracker,
} from '../../../../api/internal/UsageFrequencyTracker';
import DuplicateLimitedQueue from '../../../../DuplicateLimitedQueue';
import { grinEmoji, generateSkinVariation } from '../../_test-data';

/**
 * Extend the UsageFrequencyTracker to provide access to its queue for mocking in tests.
 */
class TestUsageFrequencyTracker extends UsageFrequencyTracker {
  constructor(queue: DuplicateLimitedQueue<string>) {
    super();
    this.queue = queue;
  }
}

describe('UsageFrequencyTracker', () => {
  describe('Gateway', () => {
    it('should not accept a maximum of less than 1', () => {
      expect(() => new Gateway(0)).to.throw(RangeError);
    });

    it('should allow work when none in-flight', done => {
      const gateway = new Gateway(1);
      expect(
        gateway.submit(() => {
          done();
        }),
      ).to.equal(true);
    });

    it('should prevent work when too much in flight', done => {
      const queueSize = 2;
      let doneCounter = 0;
      const doneCollector = () => {
        doneCounter++;
        if (doneCounter >= queueSize) {
          done();
        }
      };

      const gateway = new Gateway(queueSize);
      expect(
        gateway.submit(() => {
          doneCollector();
        }),
      ).to.equal(true);
      expect(
        gateway.submit(() => {
          doneCollector();
        }),
      ).to.equal(true);

      expect(
        gateway.submit(() => {
          doneCollector();
        }),
      ).to.equal(false);
    });

    it('should allow more work once in-flight work completes', done => {
      const queueSize = 2;
      let completedCounter = 0;

      const completeCollector = () => {
        completedCounter++;
      };

      const gateway = new Gateway(queueSize);
      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).to.equal(true);
      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).to.equal(true);

      expect(
        gateway.submit(() => {
          completeCollector();
        }),
      ).to.equal(false);

      // now delay, and periodically check if the queued work has had a chance to complete before asserting
      // that more can be queued.
      const intervalId = setInterval(() => {
        if (completedCounter > 0) {
          clearInterval(intervalId);
          expect(
            gateway.submit(() => {
              completeCollector();
            }),
          ).to.equal(true);
          done();
        }
      }, 50);
    });
  });

  describe('UsageFrequencyTracker', () => {
    let mockQueue: DuplicateLimitedQueue<string>;
    let mockEnqueue: sinon.SinonStub;
    let mockClear: sinon.SinonSpy;

    // delay and periodically check if mockEnqueue has been called
    const waitForEnqueue = (
      testCompleter: () => void,
      assertions?: () => void,
    ) => {
      // now delay, and periodically check if the work has completed.
      const intervalId = setInterval(() => {
        if (mockEnqueue.called) {
          clearInterval(intervalId);
          if (assertions) {
            assertions();
          }
          testCompleter();
        }
      }, 50);
    };

    beforeEach(() => {
      mockQueue = <DuplicateLimitedQueue<string>>{};
      mockEnqueue = sinon.stub();
      mockClear = sinon.spy();
      mockQueue.enqueue = mockEnqueue;
      mockQueue.clear = mockClear;
    });

    it('should do work asynchronously', done => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);

      tracker.recordUsage(grinEmoji);
      expect(mockEnqueue.called).to.equal(false);

      // now delay, and periodically check if the work has completed.
      waitForEnqueue(done);
    });

    it('should record base emoji not skin tone variation', done => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);
      const skinToneEmoji = generateSkinVariation(grinEmoji, 3);
      tracker.recordUsage(skinToneEmoji);

      waitForEnqueue(done, () => {
        expect(mockEnqueue.calledWith(grinEmoji.id)).to.equal(true);
      });
    });

    it('should clear the queue', () => {
      const tracker = new TestUsageFrequencyTracker(mockQueue);
      tracker.clear();
      expect(mockClear.calledOnce).to.equal(true);
    });
  });
});
