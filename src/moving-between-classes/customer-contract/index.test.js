import { CustomerContract } from '.';

describe('CustomerContract', () => {
  it('should have a discount rate', () => {
    const contract = new CustomerContract(new Date(), 0.1);
    expect(contract.discountRate).toEqual(0.1);
  });
});
