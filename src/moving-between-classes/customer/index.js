import { CustomerContract } from '../customer-contract';

const dateToday = () => new Date();

export class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._setDiscountRate(discountRate);
    this._contract = new CustomerContract(dateToday());
  }

  get discountRate() {
    return this._discountRate;
  }

  _setDiscountRate(aNumber) {
    this._discountRate = aNumber;
  }

  becomePreferred() {
    this._setDiscountRate(this.discountRate + 0.03);
    // other nice things
  }

  applyDiscount(amount) {
    const discountValue = amount.multiply(this.discountRate);
    return amount.subtract(discountValue);
  }
}
