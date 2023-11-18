import { CustomerContract } from '../customer-contract';

const dateToday = () => new Date();

export class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._discountRate = discountRate;
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() {
    return this._discountRate;
  }

  becomePreferred() {
    this._discountRate += 0.03;
    // other nice things
  }

  applyDiscount(amount) {
    const discountValue = amount.multiply(this._discountRate);
    return amount.subtract(discountValue);
  }
}
