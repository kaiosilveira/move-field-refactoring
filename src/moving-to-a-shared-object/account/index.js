import assert from 'assert';

export class Account {
  constructor(number, type, interestRate) {
    this._number = number;
    this._type = type;
    assert(interestRate === this._type.interestRate);
    this._interestRate = interestRate;
  }

  get interestRate() {
    return this._interestRate;
  }
}
