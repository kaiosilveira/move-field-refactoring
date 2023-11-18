export class AccountType {
  constructor(nameString, interestRate) {
    this._name = nameString;
    this._interestRate = interestRate;
  }

  get name() {
    return this._name;
  }

  get interestRate() {
    return this._interestRate;
  }
}
