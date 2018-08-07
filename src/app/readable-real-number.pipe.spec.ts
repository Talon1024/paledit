import { ReadableRealNumberPipe } from './percent.pipe';

describe('PercentPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableRealNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
