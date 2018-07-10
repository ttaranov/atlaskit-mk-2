import * as cases from 'jest-in-case';
import Logger, { LOG_LEVEL } from '../../../helpers/logger';

declare const global: any;

const logTypeMap = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'log',
};

describe('Logger', () => {
  it('should set log level to OFF by default', () => {
    const logger = new Logger();
    expect(logger.logLevel).toBe(LOG_LEVEL.OFF);
  });

  cases(
    'should not log any level beneath current logging level',
    ({ level, methods }) => {
      const originalConsole = global.console;
      global.console = {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        log: jest.fn(),
      };

      let logger = new Logger({ logLevel: LOG_LEVEL[level] });

      Object.keys(methods).forEach(method => {
        jest.resetAllMocks();
        const shouldBeCalled = methods[method];
        logger[method]('test');
        const consoleMethod = logTypeMap[method];
        expect(global.console[consoleMethod]).toHaveBeenCalledTimes(
          shouldBeCalled ? 1 : 0,
        );
      });

      global.console = originalConsole;
    },
    [
      {
        name: 'OFF',
        level: 'OFF',
        methods: {
          error: false,
          warn: false,
          info: false,
          debug: false,
        },
      },
      {
        name: 'ERROR',
        level: 'ERROR',
        methods: {
          error: true,
          warn: false,
          info: false,
          debug: false,
        },
      },
      {
        name: 'WARN',
        level: 'WARN',
        methods: {
          error: true,
          warn: true,
          info: false,
          debug: false,
        },
      },
      {
        name: 'INFO',
        level: 'INFO',
        methods: {
          error: true,
          warn: true,
          info: true,
          debug: false,
        },
      },
      {
        name: 'DEBUG',
        level: 'DEBUG',
        methods: {
          error: true,
          warn: true,
          info: true,
          debug: true,
        },
      },
    ],
  );
});
