declare global {
  interface BigInt {
    toJSON(): string;
  }
}

export function register() {
  // Apply the BigInt patch
  if (typeof BigInt !== 'undefined') {
    BigInt.prototype.toJSON = function (this: bigint) {
      return this.toString();
    };
  }
}
