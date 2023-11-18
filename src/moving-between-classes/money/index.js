export class Money {
  constructor(amount) {
    this._amount = amount;
  }

  add(other) {
    return new Money(this._amount + other._amount);
  }

  subtract(other) {
    return new Money(this._amount - other._amount);
  }

  multiply(scalarVlaue) {
    return new Money(this._amount * scalarVlaue);
  }
}
