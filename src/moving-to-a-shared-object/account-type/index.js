export class AccountType {
  constructor(nameString) {
    this._name = nameString;
  }

  get name() {
    return this._name;
  }
}
