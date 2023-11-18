import { CustomerContract } from '../customer-contract';

const dateToday = () => new Date();

export class Customer {
  constructor(name, discountRate) {
    this._name = name;
    this._contract = new CustomerContract(dateToday(), discountRate);
    this._setDiscountRate(discountRate);
  }

  get discountRate() {
    return this._contract._discountRate;
  }

  _setDiscountRate(aNumber) {
    this._contract._discountRate = aNumber;
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
