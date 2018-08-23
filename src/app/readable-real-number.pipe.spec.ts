import { ReadableRealNumberPipe } from './readable-real-number.pipe';

describe('PercentPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableRealNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
