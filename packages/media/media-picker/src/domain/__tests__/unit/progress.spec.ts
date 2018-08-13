'use strict';

import { expect } from 'chai';
import { SmartMediaProgress } from '../../progress';

describe('Progress class check', () => {
  /* isValidSize */
  it('method isValidSize() returns true for numbers bigger then zero', () => {
    expect(SmartMediaProgress.isValidSize(1)).to.be.equal(true);
  });

  it('method isValidSize() returns false for numbers less or equal zero', () => {
    expect(SmartMediaProgress.isValidSize(0)).to.be.equal(false);
  });

  it('method isValidSize() returns false for non-numbers', () => {
    expect(SmartMediaProgress.isValidSize('monkey')).to.be.equal(false);
  });

  /* isValidProgress */
  it('method isValidProgress() returns true for numbers equal or bigger then zero', () => {
    expect(SmartMediaProgress.isValidProgress(4444, 0)).to.be.equal(true);
  });

  it('method isValidProgress() returns false when progress is bigger then size', () => {
    expect(SmartMediaProgress.isValidProgress(4444, 5555)).to.be.equal(false);
  });

  it('method isValidProgress() returns false for numbers less then zero', () => {
    expect(SmartMediaProgress.isValidProgress(4444, -1)).to.be.equal(false);
  });

  it('method isValidProgress() returns false for non-numbers', () => {
    expect(SmartMediaProgress.isValidProgress(4444, <any>'monkey')).to.be.equal(
      false,
    );
  });

  /* isValidStartTime */
  it('method isValidStartTime returns true when startTime is bigger then zero', () => {
    expect(SmartMediaProgress.isValidStartTime(1)).to.be.equal(true);
  });

  it('method isValidStartTime returns false when startTime is equal or less then zero', () => {
    expect(SmartMediaProgress.isValidStartTime(0)).to.be.equal(false);
  });

  it('method isValidStartTime() returns false for non-numbers', () => {
    expect(SmartMediaProgress.isValidStartTime(<any>'monkey')).to.be.equal(
      false,
    );
  });

  /* isValidMeasureTime */
  it('method isValidMeasureTime() returns true when measureTime bigger then startTime', () => {
    expect(SmartMediaProgress.isValidMeasureTime(1000, 1001)).to.be.equal(true);
  });

  it('method isValidMeasureTime() returns false when measureTime is less then startTime', () => {
    expect(SmartMediaProgress.isValidMeasureTime(1000, 999)).to.be.equal(false);
  });

  it('method isValidMeasureTime() returns false for non-numbers', () => {
    expect(
      SmartMediaProgress.isValidMeasureTime(1000, <any>'monkey'),
    ).to.be.equal(false);
  });
});

describe('Progress class exposed parameters', () => {
  it('include absolute progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.absolute).to.be.equal(256);
  });

  it('include portion progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.portion).to.be.equal(0.5);
  });

  it('include max progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.max).to.be.equal(512);
  });

  it('include overallTime progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.overallTime).to.be.equal(200);
  });

  it('include expectedFinishTime progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.expectedFinishTime).to.be.equal(300);
  });

  it('include timeLeft progress', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.timeLeft).to.be.equal(100);
  });

  it('toJSON() method returns correct object', () => {
    const p = new SmartMediaProgress(512, 256, 100, 200);
    expect(p.toJSON()).to.be.deep.equal({
      absolute: 256,
      portion: 0.5,
      max: 512,
      overallTime: 200,
      expectedFinishTime: 300,
      timeLeft: 100,
    });
  });
});
