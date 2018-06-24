export class Lerp {
  static linear(n: number): number {
    return n;
  }

  static power(n: number, p: number): number {
    return Math.pow(n, p);
  }

  static sine(n: number): number {
    const factor = Math.PI / 2;
    return Math.sin(n * factor);
  }
}
