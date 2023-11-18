import { Customer } from '.';
import { Money } from '../money';

describe('Customer', () => {
  describe('becomePreferred', () => {
    it('should add 0.03 to the initial discount rate', () => {
      const customer = new Customer('John', 0.97);
      customer.becomePreferred();
      expect(customer.discountRate).toEqual(1);
    });
  });

  describe('applyDiscount', () => {
    it('should apply the discount rate to a given amount', () => {
      const customer = new Customer('John', 0.1);
      const amount = new Money(100);
      const discountedAmount = customer.applyDiscount(amount);
      expect(discountedAmount).toEqual(new Money(90));
    });
  });
});
